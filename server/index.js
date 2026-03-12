const express = require("express");
const axios = require("axios");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
const port = process.env.BACKEND_PORT || 4000;
const jiraBaseUrl = process.env.JIRA_BASE_URL || "https://your-domain.atlassian.net";
const jiraEmail = process.env.JIRA_EMAIL;
const jiraApiToken = process.env.JIRA_API_TOKEN;
const jiraStoryPointsField = process.env.JIRA_STORY_POINTS_FIELD || "customfield_10016";
const jiraChannelLabelPrefix = (process.env.JIRA_CHANNEL_LABEL_PREFIX || "channel-").toLowerCase();
const jiraTeamLabelPrefix = (process.env.JIRA_TEAM_LABEL_PREFIX || "team-").toLowerCase();
const jiraTrainLabelPrefix = (process.env.JIRA_TRAIN_LABEL_PREFIX || "train-").toLowerCase();
const openAiApiKey = process.env.OPENAI_API_KEY;
const openAiModel = process.env.OPENAI_MODEL || "gpt-4.1-mini";
const openAiClient = openAiApiKey ? new OpenAI({ apiKey: openAiApiKey }) : null;

const buildFallbackInsight = ({ projectKey, filters, kpis, rows }) => {
	const safeRows = Array.isArray(rows) ? rows : [];
	const doneCount = safeRows.filter((row) => (row.status || "").toLowerCase() === "done").length;
	const inProgressCount = safeRows.filter((row) => (row.status || "").toLowerCase().includes("progress")).length;
	const total = safeRows.length;
	const velocity = kpis?.velocity ?? 0;
	const reliability = kpis?.commitmentReliability ?? "0 %";
	const spillover = kpis?.spillover ?? "0 %";
	const scope = [`channel=${filters?.channel || "All"}`, `team=${filters?.team || "All"}`, `train=${filters?.train || "All"}`].join(", ");

	return [
		`Summary: Project ${projectKey} (${scope}) has ${total} tracked issues with ${doneCount} Done and ${inProgressCount} In Progress.`,
		`Risks: Spillover is ${spillover} and commitment reliability is ${reliability}; unresolved in-progress work may impact next sprint carryover.`,
		`Actions: Prioritize closure of top in-progress items, rebalance ownership across assignees, and review scope against current velocity (${velocity}).`,
	].join(" ");
};

app.use(express.json());

app.get("/api/health", (_req, res) => {
	res.json({ status: "ok", service: "msr-ai-analyzer-backend" });
});

const pickLabelByPrefix = (labels, prefix) => {
	const normalizedLabels = Array.isArray(labels) ? labels : [];
	const match = normalizedLabels.find((label) => label.toLowerCase().startsWith(prefix));
	if (!match) {
		return "N/A";
	}

	return match.slice(prefix.length) || "N/A";
};

app.get("/api/jira/issues", async (req, res) => {
	const projectKey = req.query.projectKey;
	const maxResults = Number(req.query.maxResults || 50);

	if (!projectKey) {
		return res.status(400).json({ error: "Missing required query param: projectKey" });
	}

	if (!jiraEmail || !jiraApiToken || jiraBaseUrl.includes("your-domain")) {
		return res.status(500).json({
			error: "Jira credentials are not configured. Set JIRA_BASE_URL, JIRA_EMAIL and JIRA_API_TOKEN.",
		});
	}

	try {
		const auth = Buffer.from(`${jiraEmail}:${jiraApiToken}`).toString("base64");
		const requestHeaders = {
			Authorization: `Basic ${auth}`,
			Accept: "application/json",
			"Content-Type": "application/json",
		};
		const requestBody = {
			jql: `project=${projectKey} ORDER BY updated DESC`,
			maxResults,
			fields: ["summary", "status", "assignee", "issuetype", "labels", jiraStoryPointsField],
		};

		let response;
		try {
			response = await axios.get(`${jiraBaseUrl}/rest/api/3/search/jql`, {
				headers: requestHeaders,
				params: {
					jql: requestBody.jql,
					maxResults: requestBody.maxResults,
					fields: requestBody.fields.join(","),
				},
			});
		} catch (jqlError) {
			const shouldFallback = [404, 405, 410].includes(jqlError.response?.status);
			if (!shouldFallback) {
				throw jqlError;
			}

			try {
				response = await axios.post(`${jiraBaseUrl}/rest/api/3/search`, requestBody, {
					headers: requestHeaders,
				});
			} catch (postError) {
				if (postError.response?.status !== 404) {
					throw postError;
				}

				response = await axios.get(`${jiraBaseUrl}/rest/api/3/search`, {
					headers: requestHeaders,
					params: {
						jql: requestBody.jql,
						maxResults: requestBody.maxResults,
						fields: requestBody.fields.join(","),
					},
				});
			}
		}

		const issues = (response.data.issues || []).map((issue) => {
			const fields = issue.fields || {};
			const labels = fields.labels || [];
			const storyPoints = Number(fields[jiraStoryPointsField] || 0);

			return {
				id: issue.id,
				key: issue.key,
				story: fields.summary || issue.key,
				issueType: fields.issuetype?.name || "Other",
				status: fields.status?.name || "Unknown",
				points: Number.isFinite(storyPoints) ? storyPoints : 0,
				assignee: fields.assignee?.displayName || "Unassigned",
				channel: pickLabelByPrefix(labels, jiraChannelLabelPrefix),
				team: pickLabelByPrefix(labels, jiraTeamLabelPrefix),
				train: pickLabelByPrefix(labels, jiraTrainLabelPrefix),
			};
		});

		return res.json({ issues, total: issues.length });
	} catch (error) {
		const statusCode = error.response?.status || 500;
		const details = error.response?.data || error.response?.statusText || error.message;

		return res.status(statusCode).json({
			error: "Failed to fetch Jira issues",
			details,
		});
	}
});

app.post("/api/ai/insights", async (req, res) => {
	const { projectKey, filters, kpis, rows } = req.body || {};

	if (!openAiClient) {
		return res.status(500).json({
			error: "AI is not configured. Set OPENAI_API_KEY in .env.",
		});
	}

	if (!projectKey) {
		return res.status(400).json({ error: "Missing projectKey in request body." });
	}

	const safeRows = Array.isArray(rows) ? rows.slice(0, 15) : [];

	const promptPayload = {
		projectKey,
		filters: filters || {},
		kpis: kpis || {},
		issueCount: safeRows.length,
		sampleIssues: safeRows.map((row) => ({
			story: row.story,
			status: row.status,
			points: row.points,
			assignee: row.assignee,
			channel: row.channel,
			team: row.team,
			train: row.train,
		})),
	};

	try {
		const completion = await openAiClient.chat.completions.create({
			model: openAiModel,
			temperature: 0.3,
			max_tokens: 220,
			messages: [
				{
					role: "system",
					content:
						"You are an agile metrics analyst. Return a concise MSR insight in plain English with exactly 3 short parts: Summary, Risks, Actions.",
				},
				{
					role: "user",
					content: `Generate AI insights from this dashboard data: ${JSON.stringify(promptPayload)}`,
				},
			],
		});

		const summary = completion.choices?.[0]?.message?.content?.trim();
		if (!summary) {
			return res.status(502).json({ error: "OpenAI returned an empty insight." });
		}

		return res.json({ summary, model: openAiModel });
	} catch (error) {
		const statusCode = error.status || error.response?.status;
		if (statusCode === 429) {
			const fallbackSummary = buildFallbackInsight({ projectKey, filters, kpis, rows });
			return res.json({
				summary: fallbackSummary,
				model: "rule-based-fallback",
				warning: "OpenAI quota exceeded; fallback insight generated.",
			});
		}

		return res.status(500).json({
			error: "Failed to generate AI insights",
			details: error.response?.data || error.message,
		});
	}
});

app.listen(port, () => {
	console.log(`Backend running at http://localhost:${port}`);
});
