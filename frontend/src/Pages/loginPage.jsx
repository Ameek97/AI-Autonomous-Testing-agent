
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "./Context";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { setlogedin } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      setlogedin(true);
      navigate("/workspace", { replace: true });
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    
      <div className="login-page">
      <div className="login-card">

        /* login header */
        <div className="login-header">
          <h1>Welcome back</h1>
          <p>Sign in to continue to your workspace.</p>
        </div>


        /* the form for login */
        <form onSubmit={handleLogin}>

          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required/>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>

        </form>

        {/* the option for signup */}
        <p className="login-footer">
          Don't have an account? <Link to="/signup">Create an account</Link>
        </p>

      </div>
    </div>
  );
}

export default Login;
