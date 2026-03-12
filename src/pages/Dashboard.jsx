import React, { useMemo, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import VelocityChart from "../components/charts/VelocityChart";
import StoryTypePie from "../components/charts/StoryTypePie";
import AiSummaryBox from "../components/ai/AiSummaryBox";
import MsrTable from "../components/tables/MsrTable";
import KpiCard from "../components/kpis/KpiCard";
import useJiraData from "../hooks/useJiraData";
import useAiInsights from "../hooks/useAiInsights";
import "../styles/dashboard.css";

const Dashboard = () => {
	const [projectKey, setProjectKey] = useState(process.env.REACT_APP_JIRA_PROJECT_KEY || "MSR");
	const [channelFilter, setChannelFilter] = useState("All");
	const [teamFilter, setTeamFilter] = useState("All");
	const [trainFilter, setTrainFilter] = useState("All");
	const { rows, loading, error } = useJiraData(projectKey);

	const channelOptions = useMemo(
		() => ["All", ...new Set(rows.map((row) => row.channel).filter((value) => value && value !== "N/A"))],
		[rows]
	);
	const teamOptions = useMemo(
		() => ["All", ...new Set(rows.map((row) => row.team).filter((value) => value && value !== "N/A"))],
		[rows]
	);
	const trainOptions = useMemo(
		() => ["All", ...new Set(rows.map((row) => row.train).filter((value) => value && value !== "N/A"))],
		[rows]
	);

	const filteredRows = useMemo(
		() =>
			rows.filter(
				(row) =>
					(channelFilter === "All" || row.channel === channelFilter) &&
					(teamFilter === "All" || row.team === teamFilter) &&
					(trainFilter === "All" || row.train === trainFilter)
			),
		[rows, channelFilter, teamFilter, trainFilter]
	);

	const filteredKpis = useMemo(() => {
		if (!filteredRows.length) {
			return {
				velocity: 0,
				commitmentReliability: "0 %",
				spillover: "0 %",
			};
		}

		const doneRows = filteredRows.filter((row) => row.status.toLowerCase() === "done");
		const inProgressRows = filteredRows.filter((row) => row.status.toLowerCase().includes("progress"));
		const totalPoints = filteredRows.reduce((acc, row) => acc + (Number(row.points) || 0), 0);
		const donePoints = doneRows.reduce((acc, row) => acc + (Number(row.points) || 0), 0);
		const spilloverPoints = inProgressRows.reduce((acc, row) => acc + (Number(row.points) || 0), 0);
		const hasStoryPoints = totalPoints > 0;
		const totalIssueCount = filteredRows.length;
		const doneIssueCount = doneRows.length;
		const inProgressIssueCount = inProgressRows.length;

		return {
			velocity: hasStoryPoints ? donePoints : doneIssueCount,
			commitmentReliability: hasStoryPoints
				? `${Math.round((donePoints / Math.max(totalPoints, 1)) * 100)} %`
				: `${Math.round((doneIssueCount / Math.max(totalIssueCount, 1)) * 100)} %`,
			spillover: hasStoryPoints
				? `${Math.round((spilloverPoints / Math.max(totalPoints, 1)) * 100)} %`
				: `${Math.round((inProgressIssueCount / Math.max(totalIssueCount, 1)) * 100)} %`,
		};
	}, [filteredRows]);

	const issueTypePieData = useMemo(() => {
		const counts = filteredRows.reduce((acc, row) => {
			const issueType = row.issueType || "Other";
			acc[issueType] = (acc[issueType] || 0) + 1;
			return acc;
		}, {});

		return Object.entries(counts).map(([name, value]) => ({ name, value }));
	}, [filteredRows]);

	const aiFilters = useMemo(
		() => ({
			channel: channelFilter,
			team: teamFilter,
			train: trainFilter,
		}),
		[channelFilter, teamFilter, trainFilter]
	);

	const { summary: aiSummary, loading: aiLoading, error: aiError } = useAiInsights({
		projectKey,
		filters: aiFilters,
		rows: filteredRows,
		kpis: filteredKpis,
		blocked: loading || Boolean(error),
	});

	const renderedAiSummary = aiLoading
		? "Generating AI insights..."
		: aiError
			? `AI insights unavailable: ${aiError}`
			: aiSummary;

	return (
		<div className="dashboard-root">
			<Sidebar />
			<div className="dashboard-main">
				<Header title="Dashboard" />
				<div className="dashboard-filters">
					<input
						className="dashboard-input"
						type="text"
						value={projectKey}
						onChange={(event) => setProjectKey(event.target.value.toUpperCase())}
						placeholder="Jira Project Key"
					/>
					<select value={channelFilter} onChange={(event) => setChannelFilter(event.target.value)}>
						{channelOptions.map((option) => (
							<option key={option} value={option}>{option === "All" ? "All Channels" : option}</option>
						))}
					</select>
					<select value={teamFilter} onChange={(event) => setTeamFilter(event.target.value)}>
						{teamOptions.map((option) => (
							<option key={option} value={option}>{option === "All" ? "All Teams" : option}</option>
						))}
					</select>
					<select value={trainFilter} onChange={(event) => setTrainFilter(event.target.value)}>
						{trainOptions.map((option) => (
							<option key={option} value={option}>{option === "All" ? "All Trains" : option}</option>
						))}
					</select>
				</div>
				<div className="dashboard-kpis">
					<KpiCard label="Velocity" value={filteredKpis.velocity} />
					<KpiCard label="Commitment Reliability" value={filteredKpis.commitmentReliability} />
					<KpiCard label="Spillover %" value={filteredKpis.spillover} />
				</div>
				<div className="dashboard-charts-row">
					<div className="dashboard-chart">
						<VelocityChart />
					</div>
					<div className="dashboard-chart">
						<StoryTypePie data={issueTypePieData} />
					</div>
					<div className="dashboard-ai-summary">
						<AiSummaryBox summary={renderedAiSummary} />
					</div>
				</div>
				<div className="dashboard-table-row">
					<div className="dashboard-table-panel">
						<h2 className="dashboard-section-title">MSR Metrics</h2>
						<MsrTable rows={filteredRows} loading={loading} error={error} />
					</div>
					<div className="dashboard-ai-summary">
						<AiSummaryBox summary={renderedAiSummary} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
