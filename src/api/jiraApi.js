import axios from "axios";

export const fetchJiraIssues = async (projectKey) => {
	const response = await axios.get("/api/jira/issues", {
		params: { projectKey },
	});

	return response.data.issues || [];
};
