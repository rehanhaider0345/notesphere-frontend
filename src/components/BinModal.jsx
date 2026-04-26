import React, { useEffect } from 'react'
import { useNotes } from '../context/NotesContext'

function BinModal({ open, onClose })
{
  const { binNotes, fetchBinNotes, restoreNote, deleteForever } = useNotes()

  useEffect(() =>
  {
    if (open)
    {
      fetchBinNotes()
    }
  }, [open])

  if (!open) return null

  return (
    <div style={overlayStyle}>

      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>

        {/* HEADER */}
        <div style={headerStyle}>
          <h2 style={{ margin: 0 }}>🗑 Bin</h2>

          <button onClick={onClose} style={closeBtn}>
            ✖
          </button>
        </div>

        {/* CONTENT */}
        <div style={{ marginTop: 20 }}>

          {binNotes.length === 0 && (
            <p style={{ opacity: 0.6 }}>No deleted notes</p>
          )}

          {binNotes.map(note => (
            <div key={note.id} style={cardStyle(note.color)}>

              <h3 style={{ margin: 0 }}>{note.title}</h3>

              <p style={{ fontSize: 12, opacity: 0.7 }}>
                Deleted: {note.deletedAt}
              </p>

              <div style={{ display: 'flex', gap: 10 }}>

                <button
                  onClick={() => restoreNote(note.id)}
                  style={btnRestore}
                >
                  ♻ Restore
                </button>

                <button
                  onClick={() => deleteForever(note.id)}
                  style={btnDelete}
                >
                  🗑 Delete Forever
                </button>

              </div>

            </div>
          ))}

        </div>

      </div>
    </div>
  )
}

export default BinModal

// ================= STYLES =================

const overlayStyle =
{
  position: 'fixed',
  inset: 0,

  background: 'rgba(0,0,0,0.65)',

  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  zIndex: 99999,          // 🔥 FIX: ALWAYS ON TOP
  backdropFilter: 'blur(6px)'
}

const modalStyle =
{
  width: '520px',
  maxHeight: '80vh',
  overflowY: 'auto',

  background: '#ffffff',

  borderRadius: 16,

  padding: 20,

  boxShadow: '0 25px 70px rgba(0,0,0,0.25)',

  border: '1px solid rgba(0,0,0,0.08)'
}

const headerStyle =
{
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}

const closeBtn =
{
  background: 'transparent',
  border: 'none',
  fontSize: 18,
  cursor: 'pointer'
}

const cardStyle = (color) => ({
  background: color || '#f5f5f5',
  padding: '12px',
  marginBottom: '12px',
  borderRadius: 10,
  border: '1px solid rgba(0,0,0,0.08)'
})

const btnRestore =
{
  padding: '6px 10px',
  borderRadius: 8,
  border: 'none',
  cursor: 'pointer',
  background: '#2ecc71',
  color: '#fff'
}

const btnDelete =
{
  padding: '6px 10px',
  borderRadius: 8,
  border: 'none',
  cursor: 'pointer',
  background: '#e53935',
  color: '#fff'
}