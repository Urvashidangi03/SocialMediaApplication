import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (name === 'confirm' || name === 'password') setError('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (form.password !== form.confirm) {
      setError('Passwords do not match')
      return
    }

    const registerData = {
      username: form.username,
      email: form.email,
      password: form.password
    }

    fetch('http://localhost:3001/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData),
      credentials: 'include'
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(data => {
          throw new Error(data.message || 'Registration failed')
        })
      }
      return response.json()
    })
    .then(data => {
      alert('Registration successful! Please login.')
      window.location.href = '/login'
    })
    .catch(error => {
      setError(error.message)
      console.error('Registration error:', error)
    })
  }

  return (
    <div className="screen">
      <div className="container">
        <div className="card form-card" role="region" aria-label="Register">
          <div className="form-header">
            <h1 style={{ margin: 0 }}>Create your account</h1>
            <p className="muted">Join the community in seconds.</p>
          </div>

          <form className="form" onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                placeholder="johndoe"
                className="input"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>

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
                autoComplete="new-password"
                placeholder="••••••••"
                className="input"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>

            <div className="field">
              <label htmlFor="confirm">Confirm password</label>
              <input
                id="confirm"
                name="confirm"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                className="input"
                value={form.confirm}
                onChange={handleChange}
                required
                minLength={6}
              />
              {error ? <div className="error" role="alert">{error}</div> : null}
            </div>

            <button type="submit" className="btn-block">Create account</button>
          </form>

          <div className="form-footer">
            <span>Already have an account? </span>
            <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  )
}