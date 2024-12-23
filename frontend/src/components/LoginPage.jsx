import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setUserInfo } = useContext(UserContext);

  async function login(ev) {
    ev.preventDefault();
    if (!username || !password) {
      setError("Both username and password are required.");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (response.ok) {
        const userInfo = await response.json();
        setUserInfo(userInfo);
        setRedirect(true);
      } else {
        setError('Wrong credentials');
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        margin: 0,
        position: "relative",
        top: "-30px", // Move the form slightly upwards
      }}
    >
      <form
        className="login"
        onSubmit={login}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          padding: "30px 20px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          backgroundColor: "#ffffff",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)", // Enhanced shadow for depth
          maxWidth: "350px",
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
          Login
        </h1>
        {error && (
          <p
            style={{
              color: "red",
              fontSize: "0.9rem",
              textAlign: "center",
              marginBottom: "10px",
            }}
          >
            {error}
          </p>
        )}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
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
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
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
          disabled={loading}
          style={{
            padding: "12px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: loading ? "#ccc" : "#007bff",
            color: "#ffffff",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background-color 0.3s",
          }}
          onMouseOver={(e) =>
            !loading && (e.target.style.backgroundColor = "#0056b3")
          }
          onMouseOut={(e) =>
            !loading && (e.target.style.backgroundColor = "#007bff")
          }
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
