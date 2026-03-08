import axios from "axios";

const JIRA_BASE_URL = "https://your-domain.atlassian.net/rest/api/3";

export const fetchJiraIssues = async (projectKey, authToken) => {
	try {
		const response = await axios.get(
			`${JIRA_BASE_URL}/search?jql=project=${projectKey}`,
			{
				headers: {
					Authorization: `Basic ${authToken}`,
					"Content-Type": "application/json",
				},
			}
		);
		return response.data.issues;
	} catch (error) {
		console.error("Jira API error:", error);
		return [];
	}
};
