import React from "react";
import "../../styles/dashboard.css";

const AiSummaryBox = ({ summary }) => (
	<div className="ai-summary-box">
		<div className="ai-summary-title">AI Insights</div>
		<div className="ai-summary-content">{summary}</div>
	</div>
);

export default AiSummaryBox;
