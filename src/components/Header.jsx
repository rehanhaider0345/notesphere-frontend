import React, { useState } from 'react'
import ConfirmModal from './ConfirmModal'
import { useTheme } from '../context/ThemeContext'
import API_BASE from '../config/api'
import logo from '../assets/logo.png'

function Header({
  search,
  setSearch,
  allTags = [],
  selectedTags = [],
  toggleTag,
  clearTagFilters,
  setUser,
  user,
  onOpenSessions,
  onOpenBin   
})
{
  const { theme, setTheme } = useTheme()

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  // ================= LOGOUT =================
  const handleLogout = async () =>
  {
    try
    {
      if (user?.session_id)
      {
        await fetch(`${API_BASE}/logout.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: user.session_id
          })
        })
      }
    }
    catch (err)
    {
      console.log("Logout API error:", err)
    }

    localStorage.removeItem("user")
    setUser(null)
  }

  // ================= TAGS =================
  const normalizedTags = Array.isArray(allTags)
    ? allTags.map(t => typeof t === 'string' ? t : t.tag)
    : []

  // ================= THEME =================
  const handleThemeChange = async (value) =>
  {
    setTheme(value)

    if (user?.user_id)
    {
      await fetch(`${API_BASE}/update_theme.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.user_id,
          theme: value
        })
      }).catch(err =>
      {
        console.log("Theme update failed:", err)
      })
    }
  }

  return (
    <>
      {/* ================= HEADER ================= */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          background: 'var(--card)',
          borderBottom: '1px solid var(--border)',
          backdropFilter: 'blur(10px)',
          position: 'sticky',
          top: 0,
          zIndex: 1000
        }}
      >

        {/* ===== LEFT (LOGO) ===== */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>

          <img src={logo} alt="logo" style={{ width: 42, height: 42 }} />

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 style={{
              margin: 0,
              fontSize: 24,
              fontWeight: 900,
              background: 'linear-gradient(90deg, #e53935, #ff6b6b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              NoteSphere
            </h1>

            <div style={{
              fontSize: 12,
              color: 'var(--muted)',
              marginTop: 4
            }}>
              👤 {user?.username || 'Guest'}
            </div>
          </div>
        </div>

        {/* ===== SEARCH ===== */}
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search notes..."
          style={{
            padding: '8px 12px',
            borderRadius: 10,
            border: '1px solid var(--border)',
            width: '40%',
            outline: 'none'
          }}
        />

        {/* ===== RIGHT SIDE ===== */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

          {/* THEME */}
          <select
            value={theme}
            onChange={e => handleThemeChange(e.target.value)}
            style={{
              padding: '6px',
              borderRadius: 8,
              border: '1px solid var(--border)'
            }}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>

          {/* 🔐 SESSIONS */}
          <button
            onClick={onOpenSessions}
            style={{
              background: '#333',
              color: '#fff',
              border: 'none',
              padding: '6px 12px',
              borderRadius: 8,
              cursor: 'pointer'
            }}
          >
            Sessions
          </button>

          {/* LOGOUT */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            style={{
              background: '#e53935',
              color: '#fff',
              border: 'none',
              padding: '6px 12px',
              borderRadius: 8,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* ================= TAG FILTERS ================= */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        padding: '10px 20px'
      }}>
        {normalizedTags.map(tag =>
        {
          const active = selectedTags.includes(tag)

          return (
            <button
              key={tag}
              onClick={() => toggleTag?.(tag)}
              style={{
                padding: '5px 10px',
                borderRadius: 999,
                border: active
                  ? '2px solid #ff8800'
                  : '1px solid var(--border)',
                background: active
                  ? 'rgba(255,136,0,0.15)'
                  : 'transparent',
                cursor: 'pointer'
              }}
            >
              #{tag}
            </button>
          )
        })}

        {selectedTags.length > 0 && (
          <button onClick={clearTagFilters}>
            Clear
          </button>
        )}
      </div>

      {/* ================= LOGOUT MODAL ================= */}
      <ConfirmModal
        open={showLogoutConfirm}
        title="Logout?"
        message="Are you sure you want to logout?"
        confirmText="Yes"
        cancelText="No"
        onConfirm={() =>
        {
          setShowLogoutConfirm(false)
          handleLogout()
        }}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </>
  )
}

export default Header
