import React from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import VelocityChart from "../components/charts/VelocityChart";
import StoryTypePie from "../components/charts/StoryTypePie";
import AiSummaryBox from "../components/ai/AiSummaryBox";
import MsrTable from "../components/tables/MsrTable";
import KpiCard from "../components/kpis/KpiCard";
import "../styles/dashboard.css";

const Dashboard = () => {
	return (
		<div className="dashboard-root">
			<Sidebar />
			<div className="dashboard-main">
				<Header title="Dashboard" />
				<div className="dashboard-filters">
					<select><option>Train A</option></select>
					<select><option>Channel X</option></select>
					<select><option>Team Alpha</option></select>
					<select><option>January</option></select>
				</div>
				<div className="dashboard-kpis">
					<KpiCard label="Velocity" value={35} />
					<KpiCard label="Commitment Reliability" value="92 %" />
					<KpiCard label="Spillover %" value={5} />
				</div>
				<div className="dashboard-charts-row">
					<div className="dashboard-chart">
						<VelocityChart />
					</div>
					<div className="dashboard-chart">
						<StoryTypePie />
					</div>
					<div className="dashboard-ai-summary">
						<AiSummaryBox summary="Train A achieved strong velocity with high commitment reliability. Spillover was minimal, but the defect ratio needs attention." />
					</div>
				</div>
				<div className="dashboard-table-row">
					<MsrTable />
					<div className="dashboard-ai-summary">
						<AiSummaryBox summary="Train A achieved strong velocity with high commitment reliability. Spillover was minimal, but the defect ratio needs attention." />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
