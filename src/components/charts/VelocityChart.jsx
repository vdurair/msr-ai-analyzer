import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
	{ name: "Week 1", velocity: 30 },
	{ name: "Week 2", velocity: 35 },
	{ name: "Week 3", velocity: 32 },
	{ name: "Week 4", velocity: 28 },
];

const VelocityChart = () => (
	<ResponsiveContainer width="100%" height={180}>
		<BarChart data={data}>
			<CartesianGrid strokeDasharray="3 3" />
			<XAxis dataKey="name" />
			<YAxis />
			<Tooltip />
			<Bar dataKey="velocity" fill="#8884d8" />
		</BarChart>
	</ResponsiveContainer>
);

export default VelocityChart;
