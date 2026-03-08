import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const data = [
	{ name: "Story", value: 60 },
	{ name: "Bug", value: 25 },
	{ name: "Task", value: 15 },
];
const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const StoryTypePie = () => (
	<ResponsiveContainer width="100%" height={180}>
		<PieChart>
			<Pie
				data={data}
				dataKey="value"
				nameKey="name"
				cx="50%"
				cy="50%"
				outerRadius={60}
				fill="#8884d8"
				label
			>
				{data.map((entry, index) => (
					<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
				))}
			</Pie>
			<Tooltip />
		</PieChart>
	</ResponsiveContainer>
);

export default StoryTypePie;
