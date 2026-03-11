import React from "react";
import "../../styles/dashboard.css";

const MsrTable = ({ rows, loading, error }) => (
	<table className="msr-table">
		<thead>
			<tr>
				<th>Story</th>
				<th>Status</th>
				<th>Points</th>
				<th>Assignee</th>
				<th>Channel</th>
				<th>Team</th>
				<th>Train</th>
			</tr>
		</thead>
		<tbody>
			{loading && (
				<tr>
					<td className="msr-table-message" colSpan={7}>Loading Jira issues...</td>
				</tr>
			)}
			{!loading && error && (
				<tr>
					<td className="msr-table-message msr-table-error" colSpan={7}>{error}</td>
				</tr>
			)}
			{!loading && !error && rows.length === 0 && (
				<tr>
					<td className="msr-table-message" colSpan={7}>No issues found for this project key.</td>
				</tr>
			)}
			{!loading && !error && rows.map((row, idx) => (
				<tr key={`${row.story}-${idx}`}>
					<td>{row.story}</td>
					<td>{row.status}</td>
					<td>{row.points}</td>
					<td>{row.assignee}</td>
					<td>{row.channel}</td>
					<td>{row.team}</td>
					<td>{row.train}</td>
				</tr>
			))}
		</tbody>
	</table>
);

export default MsrTable;
