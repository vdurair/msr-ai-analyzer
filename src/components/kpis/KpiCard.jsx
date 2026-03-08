import React from "react";
import "../../styles/dashboard.css";

const KpiCard = ({ label, value }) => (
	<div className="kpi-card">
		<div className="kpi-label">{label}</div>
		<div className="kpi-value">{value}</div>
	</div>
);

export default KpiCard;
