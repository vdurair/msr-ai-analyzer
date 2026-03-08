import React from "react";
import "../../styles/dashboard.css";

const tableData = [
	{ story: "Replay", status: "In Progress", points: 8, assignee: "Jane", team: "Alpha", train: "A" },
	{ story: "Bugfix", status: "Done", points: 5, assignee: "Igor", team: "Alpha", train: "A" },
];

const MsrTable = () => (
	<table className="msr-table">
		<thead>
			<tr>
				<th>Story</th>
				<th>Status</th>
				<th>Points</th>
				<th>Assignee</th>
				<th>Team</th>
				<th>Train</th>
			</tr>
		</thead>
		<tbody>
			{tableData.map((row, idx) => (
				<tr key={idx}>
					<td>{row.story}</td>
					<td>{row.status}</td>
					<td>{row.points}</td>
					<td>{row.assignee}</td>
					<td>{row.team}</td>
					<td>{row.train}</td>
				</tr>
			))}
		</tbody>
	</table>
);

export default MsrTable;
