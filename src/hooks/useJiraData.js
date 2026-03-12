import { useEffect, useMemo, useState } from "react";
import { fetchJiraIssues } from "../api/jiraApi";

const percent = (value) => `${Math.round(value)} %`;

const useJiraData = (projectKey) => {
	const [issues, setIssues] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		if (!projectKey) {
			setIssues([]);
			setError("");
			return;
		}

		const load = async () => {
			setLoading(true);
			setError("");
			try {
				const result = await fetchJiraIssues(projectKey);
				setIssues(result);
			} catch (err) {
				setIssues([]);
				const backendDetails = err.response?.data?.details;
				const detailMessage =
					backendDetails?.errorMessages?.[0] ||
					backendDetails?.message ||
					(backendDetails && typeof backendDetails === "string" ? backendDetails : "");

				setError(detailMessage || err.response?.data?.error || err.message || "Unable to load Jira data");
			} finally {
				setLoading(false);
			}
		};

		load();

		// Refresh periodically so UI recovers automatically after backend comes up.
		const refreshInterval = setInterval(load, 30000);

		return () => {
			clearInterval(refreshInterval);
		};
	}, [projectKey]);

	const rows = useMemo(
		() =>
			issues.map((issue) => ({
				story: issue.story,
				issueType: issue.issueType || "Other",
				status: issue.status,
				points: issue.points,
				assignee: issue.assignee,
				channel: issue.channel,
				team: issue.team,
				train: issue.train,
			})),
		[issues]
	);

	const kpis = useMemo(() => {
		if (!issues.length) {
			return {
				velocity: 0,
				commitmentReliability: "0 %",
				spillover: "0 %",
			};
		}

		const done = issues.filter((issue) => issue.status.toLowerCase() === "done");
		const inProgress = issues.filter((issue) => issue.status.toLowerCase().includes("progress"));
		const totalPoints = issues.reduce((acc, issue) => acc + (Number(issue.points) || 0), 0);
		const donePoints = done.reduce((acc, issue) => acc + (Number(issue.points) || 0), 0);
		const spilloverPoints = inProgress.reduce((acc, issue) => acc + (Number(issue.points) || 0), 0);

		return {
			velocity: donePoints,
			commitmentReliability: percent((donePoints / Math.max(totalPoints, 1)) * 100),
			spillover: percent((spilloverPoints / Math.max(totalPoints, 1)) * 100),
		};
	}, [issues]);

	return { rows, kpis, loading, error };
};

export default useJiraData;
