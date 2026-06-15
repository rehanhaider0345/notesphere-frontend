import React, { useState } from 'react'
import { useTheme } from './context/ThemeContext'
import API_BASE from './config/api'

function Auth({ onAuthSuccess })
{
  const { setTheme } = useTheme()

  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handleChange = (e) =>
  {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const safeParse = (text, fallback = null) =>
  {
    try
    {
      return JSON.parse(text)
    }
    catch
    {
      console.log("INVALID JSON:", text)
      return fallback
    }
  }

  const handleSubmit = async (e) =>
  {
    e.preventDefault()
    setError('')

    try
    {
      const url = isLogin
        ? `${API_BASE}/login.php`
        : `${API_BASE}/signup.php`

      const payload = isLogin
        ? { username: form.username, password: form.password }
        : form

      const res = await fetch(url,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      const text = await res.text()
      const data = safeParse(text)

      if (!data || data.status !== "success")
      {
        setError(data?.message || "Something went wrong")
        return
      }

      // ================= LOGIN =================
      if (isLogin)
      {
        localStorage.setItem("user", JSON.stringify(data.user))
        localStorage.setItem("session_id", data.session_id)

        try
        {
          const themeRes = await fetch(
            `${API_BASE}/get_theme.php?user_id=${data.user.user_id}`
          )

          const themeText = await themeRes.text()
          const themeData = safeParse(themeText, {})

          setTheme(themeData?.theme || "light")
        }
        catch (err)
        {
          console.log("Theme fetch failed:", err)
          setTheme("light")
        }

        onAuthSuccess(data.user)
      }

      // ================= SIGNUP =================
      else
      {
        setIsLogin(true)
        setForm({ username: '', email: '', password: '' })
        setError("Account created successfully. Please login.")
      }

    }
    catch (err)
    {
      console.log("AUTH ERROR:", err)
      setError("Server error. Try again.")
    }
  }

  return (
    <div style={pageStyle}>

      <div style={cardStyle}>

        {/* LOGO */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <img
            src="/logo.png"
            alt="logo"
            style={logoStyle}
          />
        </div>

        {/* TITLE */}
        <h2 style={titleStyle}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>

        {/* FORM */}
        <form onSubmit={handleSubmit}>

          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
            style={inputStyle}
          />

          {!isLogin && (
            <input
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
              style={inputStyle}
            />
          )}

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <button style={btnStyle}>
            {isLogin ? 'Login' : 'Sign Up'}
          </button>

        </form>

        {/* ERROR */}
        {error && (
          <p style={errorStyle}>{error}</p>
        )}

        {/* SWITCH */}
        <p style={switchStyle}>
          {isLogin ? 'No account?' : 'Already have account?'}
          <span
            onClick={() =>
            {
              setIsLogin(!isLogin)
              setError('')
            }}
            style={switchLink}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>

      </div>
    </div>
  )
}

export default Auth

// ================= LIGHT UI STYLES =================

const pageStyle =
{
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',

  background: 'linear-gradient(135deg, #e3f2fd, #fce4ec)'
}

const cardStyle =
{
  width: 400,
  padding: '2rem',
  borderRadius: 18,

  background: 'rgba(255, 255, 255, 0.75)',
  backdropFilter: 'blur(14px)',

  border: '1px solid rgba(0,0,0,0.08)',
  boxShadow: '0 20px 50px rgba(0,0,0,0.1)',

  color: '#222'
}

const logoStyle =
{
  width: 110,
  height: 110,
  objectFit: 'contain'
}

const titleStyle =
{
  textAlign: 'center',
  marginBottom: 20,
  fontWeight: 800,
  color: '#333',
  letterSpacing: 0.5
}

const inputStyle =
{
  width: '100%',
  padding: '12px',
  margin: '8px 0',

  borderRadius: 10,
  border: '1px solid rgba(0,0,0,0.15)',

  background: '#fff',
  color: '#111',

  outline: 'none'
}

const btnStyle =
{
  width: '100%',
  padding: '12px',
  marginTop: '12px',

  background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
  color: '#fff',

  border: 'none',
  borderRadius: 10,

  fontWeight: 'bold',
  cursor: 'pointer',

  boxShadow: '0 10px 25px rgba(0, 150, 255, 0.25)'
}

const errorStyle =
{
  color: '#e53935',
  marginTop: 10,
  textAlign: 'center'
}

const switchStyle =
{
  textAlign: 'center',
  marginTop: 12,
  color: '#555'
}

const switchLink =
{
  color: '#1976d2',
  cursor: 'pointer',
  marginLeft: 6,
  fontWeight: 600
}
