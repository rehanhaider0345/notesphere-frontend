import React, { useEffect, useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import API_BASE from '../config/api'

function SessionHistory({ user })
{
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [hovered, setHovered] = useState(null)

  // ================= FETCH =================
  useEffect(() =>
  {
    if (!user?.user_id) return

    setLoading(true)

    fetch(`${API_BASE}/get_sessions.php?user_id=${user.user_id}`)
      .then(res => res.json())
      .then(data =>
      {
        setSessions(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() =>
      {
        setSessions([])
        setLoading(false)
      })
  }, [user])

  // ================= CLEAR SESSIONS =================
  const handleClearSessions = async () =>
  {
    try
    {
      const storedUser = JSON.parse(localStorage.getItem("user"))

      const res = await fetch(`${API_BASE}/clear_sessions.php`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: storedUser?.user_id
        })
      })

      const data = await res.json()

      if (data.status === "success")
      {
        setSessions([])
      }
    }
    catch (err)
    {
      console.log("Clear sessions error:", err)
    }
  }

  return (
    <div style={{ padding: 10 }}>

      {/* TITLE */}
      <h3 style={{
        marginBottom: 10,
        fontWeight: 900,
        color: isDark ? '#fff' : '#111',
        letterSpacing: 0.5
      }}>
        🔐 Session History
      </h3>

      {/* CLEAR BUTTON */}
      {sessions.length > 0 && (
        <button
          onClick={handleClearSessions}
          style={{
            background: '#e53935',
            color: '#fff',
            border: 'none',
            padding: '6px 12px',
            borderRadius: 8,
            cursor: 'pointer',
            marginBottom: 12,
            fontWeight: 600
          }}
        >
          🧨 Clear Session History
        </button>
      )}

      {/* LOADING */}
      {loading && (
        <p style={{ color: isDark ? '#aaa' : '#666' }}>
          Loading sessions...
        </p>
      )}

      {/* EMPTY */}
      {!loading && sessions.length === 0 && (
        <p style={{
          opacity: 0.6,
          color: isDark ? '#bbb' : '#666'
        }}>
          No sessions found
        </p>
      )}

      {/* SESSION CARDS */}
      {!loading && sessions.map((s, i) => (
        <div
          key={s.session_id || i}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
          style={{
            background: isDark ? '#181818' : '#ffffff', // solid theme-matched
            border: isDark ? '1px solid #2a2a2a' : '1px solid #e6e6e6',
            borderLeft: hovered === i ? '4px solid #ff3b30' : '4px solid #e53935',
            padding: '14px',
            marginBottom: 12,
            borderRadius: 14,

            boxShadow: hovered === i
              ? (isDark
                  ? '0 12px 28px rgba(0,0,0,0.65)'
                  : '0 10px 25px rgba(0,0,0,0.12)')
              : (isDark
                  ? '0 8px 20px rgba(0,0,0,0.45)'
                  : '0 4px 12px rgba(0,0,0,0.08)'),

            transform: hovered === i ? 'translateY(-2px)' : 'translateY(0)',
            transition: 'all 0.2s ease',
            cursor: 'default'
          }}
        >

          {/* HEADER */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 6
          }}>
            <b style={{ color: isDark ? '#fff' : '#111' }}>
              Session #{s.session_id || i + 1}
            </b>

            <span style={{
              fontSize: 11,
              fontWeight: 700,
              color: s.logout_time ? '#888' : '#e53935'
            }}>
              {s.logout_time ? 'ENDED' : 'ACTIVE'}
            </span>
          </div>

          {/* DETAILS */}
          <div style={{
            fontSize: 13,
            lineHeight: 1.6,
            color: isDark ? '#cfcfcf' : '#555'
          }}>
            <div>📅 Login: {s.login_time}</div>
            <div>📅 Logout: {s.logout_time || 'Still Active'}</div>
            <div>📍 Device: {s.device_info || 'Unknown Device'}</div>
            <div>🌐 IP: {s.ip || 'Unknown IP'}</div>
          </div>

        </div>
      ))}
    </div>
  )
}

export default SessionHistory
