import React from "react";
import "../../styles/dashboard.css";

const Header = ({ title }) => (
	<header className="dashboard-header">
		<h2>{title}</h2>
	</header>
);

export default Header;
