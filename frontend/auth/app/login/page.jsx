"use client";

import React, { useState } from "react";

const LoginForm = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = (event) => {
		event.preventDefault();
		if (username && password) {
			console.log("Logging in with", { username, password });
			// Here you can send the credentials to your backend
		} else {
			setError("Please fill in both fields");
		}
	};

	return 
		<div>
	
	</div>;
};

export default LoginForm;
