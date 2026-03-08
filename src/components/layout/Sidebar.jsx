import React from "react";
import "../../styles/dashboard.css";

const Sidebar = () => (
	<aside className="sidebar">
		<div className="sidebar-title">MSR AI Analyzer</div>
		<nav>
			<ul>
				<li className="sidebar-active">Dashboard</li>
			</ul>
		</nav>
	</aside>
);

export default Sidebar;
