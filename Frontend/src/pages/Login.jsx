import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'


export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  
  const navigate = useNavigate()

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault();
    
    axios.post(
      "http://localhost:3001/auth/login",
      form,
      { withCredentials: true }
    )
      .then((res) => {
        console.log(res.data);
        navigate("/");
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error("Login failed:", error.response.data);
          alert(error.response.data.message || "Login failed. Please check your credentials.");
        } else if (error.request) {
          // The request was made but no response was received
          console.error("No response:", error.request);
          alert("Unable to connect to the server. Please try again later.");
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error:", error.message);
          alert("An error occurred. Please try again.");
        }
      });
  }


  return (
    <div className="screen">
      <div className="container">
        <div className="card form-card" role="region" aria-label="Login">
          <div className="form-header">
            <h1 style={{ margin: 0 }}>Welcome back</h1>
            <p className="muted">Sign in to continue.</p>
          </div>

          <form className="form" onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="input"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="input"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>

            <button type="submit" className="btn-block">Sign in</button>
          </form>

          <div className="form-footer">
            <span>Don’t have an account? </span>
            <Link to="/register">Register</Link>
          </div>
        </div>
      </div>
    </div>
  )
}