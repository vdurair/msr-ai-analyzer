import axios from "axios";

export const fetchAiInsights = async (payload) => {
	const response = await axios.post("/api/ai/insights", payload);
	return response.data;
};
