import { useEffect, useState } from "react";
import { fetchAiInsights } from "../api/aiApi";

const defaultSummary = "Summary: Waiting for enough data to generate insights. Risks: Limited data volume. Actions: Add or select Jira issues to continue.";

const useAiInsights = ({ projectKey, filters, rows, kpis, blocked }) => {
	const [summary, setSummary] = useState(defaultSummary);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		if (blocked || !projectKey || !rows?.length) {
			setLoading(false);
			setError("");
			setSummary(defaultSummary);
			return;
		}

		let isActive = true;

		const generate = async () => {
			setLoading(true);
			setError("");
			try {
				const result = await fetchAiInsights({ projectKey, filters, rows, kpis });
				if (!isActive) {
					return;
				}
				setSummary(result.summary || defaultSummary);
			} catch (err) {
				if (!isActive) {
					return;
				}
				const details = err.response?.data?.details;
				const detailMessage =
					details?.error?.message ||
					details?.message ||
					(typeof details === "string" ? details : "");

				setError(detailMessage || err.response?.data?.error || "Failed to generate AI insights");
				setSummary("Summary: AI insight generation failed. Risks: Team may miss trend signals. Actions: Verify OPENAI_API_KEY and retry.");
			} finally {
				if (isActive) {
					setLoading(false);
				}
			}
		};

		generate();

		return () => {
			isActive = false;
		};
	}, [projectKey, filters, rows, kpis, blocked]);

	return { summary, loading, error };
};

export default useAiInsights;
