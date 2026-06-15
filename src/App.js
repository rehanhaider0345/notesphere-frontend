import React, { useState, useCallback, useEffect } from 'react'
import Header from './components/Header'
import NoteList from './components/NoteList'
import NoteEditorModal from './components/NoteEditorModal'
import ConfirmModal from './components/ConfirmModal'
import FloatingBin from './components/FloatingBin'
import SessionHistory from './components/SessionHistory'
import BinModal from './components/BinModal'
import { useNotes } from './context/NotesContext'
import { useTheme } from './context/ThemeContext'

function App({ user, setUser })
{
  const {
    notes,
    addNote,
    updateNote,
    deleteNote,
    fetchBinNotes
  } = useNotes()

  const { theme } = useTheme()
  
  // ================= STATE =================
  const [search, setSearch] = useState('')
  const [selectedTags, setSelectedTags] = useState([])

  const [editorOpen, setEditorOpen] = useState(false)
  const [editorMode, setEditorMode] = useState('add')
  const [editorNoteId, setEditorNoteId] = useState(null)

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState(null)

  const [binOpen, setBinOpen] = useState(false)
  const [showSessions, setShowSessions] = useState(false)

  const [hoveredNoteId, setHoveredNoteId] = useState(null)

  // 🔥 DRAG STATE (CRITICAL)
  const [draggingId, setDraggingId] = useState(null)

  const isDark = theme === 'dark'

  // ================= RESET =================
  useEffect(() =>
  {
    if (!user)
    {
      setSelectedTags([])
      setSearch('')
    }
  }, [user])
  
  useEffect(() => 
  {
    document.title = "NoteSphere"
  }, [])

  // ================= BIN LOAD =================
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() =>
  {
    if (binOpen)
    {
      fetchBinNotes()
    }
  }, [binOpen])

  // ================= TAGS =================
  const getAllTags = useCallback(() =>
  {
    const set = new Set()
    notes.forEach(n => n.tags?.forEach(t => set.add(t)))
    return Array.from(set).sort()
  }, [notes])

  const allTags = getAllTags()

  // ================= FILTER =================
  const filteredNotes = notes.filter(note =>
  {
    const searchMatch =
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.contentMd.toLowerCase().includes(search.toLowerCase())

    if (!searchMatch) return false
    if (selectedTags.length === 0) return true

    return note.tags?.some(tag => selectedTags.includes(tag))
  })

  const editorNote =
    editorMode === 'edit'
      ? notes.find(n => n.id === editorNoteId)
      : null

  // ================= DELETE =================
  const handleDelete = () =>
  {
    if (pendingDeleteId)
    {
      deleteNote(pendingDeleteId)
    }

    setShowDeleteConfirm(false)
    setPendingDeleteId(null)
  }

  // ================= GUARD =================
  if (!user)
  {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 18
      }}>
        Please login to continue.
      </div>
    )
  }

  const pageStyle =
  {
    background: isDark ? '#121212' : '#f5f6fa',
    minHeight: '100vh',
    color: isDark ? '#fff' : '#111'
  }

  const container =
  {
    maxWidth: 1100,
    margin: '0 auto',
    padding: '0 20px'
  }

  return (
    <div style={pageStyle}>

      <Header
        search={search}
        setSearch={setSearch}
        allTags={allTags}
        selectedTags={selectedTags}
        toggleTag={tag =>
        {
          setSelectedTags(prev =>
            prev.includes(tag)
              ? prev.filter(t => t !== tag)
              : [...prev, tag]
          )
        }}
        clearTagFilters={() => setSelectedTags([])}
        setUser={setUser}
        user={user}
        onOpenSessions={() => setShowSessions(true)}
      />

      <div style={{
        ...container,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 25
      }}>

        <h2 style={{ margin: 0, fontWeight: 800 }}>
          My Notes
        </h2>

        <button
          onClick={() =>
          {
            setEditorMode('add')
            setEditorNoteId(null)
            setEditorOpen(true)
          }}
          style={{
            background: 'linear-gradient(135deg,#e53935,#ff6b6b)',
            color: '#fff',
            border: 'none',
            padding: '10px 16px',
            borderRadius: 12,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(229,57,53,0.25)'
          }}
        >
          + Add Note
        </button>

      </div>

      <main style={{ paddingTop: 30 }}>
        <div style={container}>

          <NoteList
            notes={filteredNotes}

            onCardClick={(id) =>
            {
              const note = notes.find(n => n.id === id)
              if (!note) return

              setEditorMode('edit')
              setEditorNoteId(id)
              setEditorOpen(true)
            }}

            hoveredNoteId={hoveredNoteId}
            setHoveredNoteId={setHoveredNoteId}

            onDragStart={(id) =>
            {
              console.log("DRAG START:", id)
              setDraggingId(id)
            }}

            onDragEnd={() =>
            {
              console.log("DRAG END")
              setDraggingId(null)
            }}

            draggingId={draggingId}

            onTagClick={() => {}}
          />

        </div>
      </main>

      <FloatingBin
        isActive={binOpen}
        onClick={() => setBinOpen(true)}

        onDrop={(id) =>
        {
          console.log("Deleting:", id)

          if (!id) return

          setPendingDeleteId(id)
          setShowDeleteConfirm(true)
        }}
      />

      {binOpen && (
        <BinModal
          open={binOpen}
          onClose={() => setBinOpen(false)}
        />
      )}

      {showSessions && (
        <div
          onClick={() => setShowSessions(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: isDark ? '#0e0e10' : '#f3f4f6',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
            zIndex: 99999
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 600,
              maxHeight: '80vh',
              overflowY: 'auto',
              background: isDark ? '#18181b' : '#fff',
              borderRadius: 18,
              padding: 24,
              border: isDark ? '1px solid #2a2a2a' : '1px solid #e5e7eb'
            }}
          >
            <SessionHistory user={user} />

            <button
              onClick={() => setShowSessions(false)}
              style={{
                marginTop: 16,
                width: '100%',
                padding: 10,
                borderRadius: 12,
                border: 'none',
                background: 'linear-gradient(135deg,#e53935,#ff6b6b)',
                color: '#fff',
                fontWeight: 700
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <ConfirmModal
        open={showDeleteConfirm}
        title="Delete note?"
        message="Are you sure?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() =>
        {
          setShowDeleteConfirm(false)
          setPendingDeleteId(null)
        }}
      />

      <NoteEditorModal
        open={editorOpen}
        mode={editorMode}
        initialNote={editorNote || { title: '', contentMd: '', color: '', tags: [] }}
        onSave={(data) =>
        {
          if (editorMode === 'add') addNote(data)
          else updateNote(editorNote.id, data)

          setEditorOpen(false)
        }}
        onRequestClose={() => setEditorOpen(false)}
      />

    </div>
  )
}

export default App
