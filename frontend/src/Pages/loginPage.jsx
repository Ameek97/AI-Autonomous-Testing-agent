
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../Context/authContext";
import "./Login.css";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const { isloggedin, setlogedin } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);  {/* loading becomes true, until some response is recieved from backend */}
  const [error, setError] = useState(""); {/* stores the error message recieved from the backend*/}

  async function handleLogin(e) {

    e.preventDefault();
    setError("");
    setLoading(true);


    try{
        
     const res = await axios.post("api/auth/login",{email, password});


     setlogedin(true);
     navigate("/workspace", { replace: true });
      
    } catch (err) {
      setError( err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  if (isloggedin) {
  return <Navigate to="/workspace" replace />; }

  return (

  
    
      <div className="login-page">
      <div className="login-card">

        {/* login header */}
        <div className="login-header">
          <h1>Welcome back</h1>
          <p>Sign in to continue to your workspace.</p>
        </div>


        {/* the form for login */}
        <form onSubmit={handleLogin}>

          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required/>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
          </div>

        
          {error && <p className="login-error"> {error} </p>} {/*if there is some error, display the error message*/}

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
