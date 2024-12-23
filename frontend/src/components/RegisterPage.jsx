import React, { useState } from "react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function register(e) {
    e.preventDefault();

    const response = await fetch("http://localhost:8000/register", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
    });
    console.log(response);
    if (response.status === 200) {
      alert("Registration successful");
    } else {
      alert("Registration failed");
    }
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        margin: 0,
         // Subtle background color
        position: "relative",
        top: "-30px", // Move the form slightly upwards
      }}
    >
      <form
        className="register"
        onSubmit={register}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px", // Better spacing between elements
          padding: "30px 20px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          backgroundColor: "#ffffff",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)", // Enhanced shadow for depth
          maxWidth: "350px", // Slightly wider form for readability
          width: "100%",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize: "1.8rem",
            color: "#333",
            marginBottom: "10px",
          }}
        >
          Register
        </h1>
        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          style={{
            padding: "12px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "1rem",
            outline: "none",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#007bff")}
          onBlur={(e) => (e.target.style.borderColor = "#ccc")}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: "12px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "1rem",
            outline: "none",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#007bff")}
          onBlur={(e) => (e.target.style.borderColor = "#ccc")}
        />
        <button
          style={{
            padding: "12px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "#007bff",
            color: "#ffffff",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
        >
          Register
        </button>
      </form>
    </div>
  );
}
