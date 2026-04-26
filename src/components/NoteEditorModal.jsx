import React, { useState, useEffect, useRef } from 'react'
import Modal from './Modal'
import { getContrastYIQ } from '../utils/colorUtils'

const COLORS = [
  '#ffe066',
  '#ffc971',
  '#5ec8e6',
  '#ff7675',
  '#55efc4',
  '#fab1a0'
]

function NoteEditorModal({
  open,
  mode = 'add',
  initialNote = { title: '', contentMd: '', color: '', tags: [] },
  onSave,
  onRequestClose
})
{
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')

  const tagInputRef = useRef()

  // ================= INIT =================
  useEffect(() =>
  {
    if (open)
    {
      setTitle(initialNote.title || '')
      setContent(initialNote.contentMd || '')
      setSelectedColor(initialNote.color || '')
      setTags(initialNote.tags || [])
      setTagInput('')
    }
  }, [open, initialNote])

  // ================= TAGS =================
  const addTag = () =>
  {
    const t = tagInput.trim()
    if (!t || tags.includes(t)) return

    setTags(prev => [...prev, t])
    setTagInput('')
    tagInputRef.current?.focus()
  }

  const removeTag = (t) =>
  {
    setTags(prev => prev.filter(x => x !== t))
  }

  const handleTagKey = (e) =>
  {
    if (e.key === 'Enter')
    {
      e.preventDefault()
      addTag()
    }
  }

  // ================= ACTIONS =================
  const handleSave = () =>
  {
    onSave?.({
      title,
      contentMd: content,
      color: selectedColor,
      tags
    })
  }

  const handleDiscard = () =>
  {
    setTitle('')
    setContent('')
    setSelectedColor('')
    setTags([])
    setTagInput('')
    onRequestClose?.()
  }

  // ================= UI =================
  return (
    <Modal open={open} onClose={onRequestClose} width="760px">

      <div style={{
        width: '100%',
        maxWidth: 720,
        margin: '0 auto',          // ✅ CENTER FIX
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        padding: '18px 16px 16px 16px' // ✅ EVEN PADDING (NO LEFT HEAVY)
      }}>

        {/* TITLE */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: 10,
            border: '1px solid var(--border)',
            fontSize: 18,
            fontWeight: 700,
            background: selectedColor || 'var(--background)',
            color: getContrastYIQ(selectedColor || '#fff')
          }}
        />

        {/* COLOR PICKER */}
        <div style={{
          display: 'flex',
          gap: 10,
          justifyContent: 'flex-start'
        }}>
          {COLORS.map(c => (
            <div
              key={c}
              onClick={() => setSelectedColor(c)}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: c,
                cursor: 'pointer',

                border: selectedColor === c
                  ? '3px solid #000'
                  : '2px solid rgba(255,255,255,0.6)',

                transform: selectedColor === c
                  ? 'scale(1.12)'
                  : 'scale(1)',

                transition: 'all 0.2s'
              }}
            />
          ))}

          <button
            onClick={() => setSelectedColor('')}
            style={{
              padding: '6px 10px',
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: 'transparent',
              cursor: 'pointer'
            }}
          >
            Clear
          </button>
        </div>

        {/* TAGS */}
        <div>
          <div style={{
            marginBottom: 6,
            fontWeight: 600
          }}>
            Tags
          </div>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            marginBottom: 8
          }}>
            {tags.map(t => (
              <div key={t} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'var(--note-bg)',
                padding: '4px 8px',
                borderRadius: 20,
                border: '1px solid var(--border)'
              }}>
                #{t}
                <span
                  onClick={() => removeTag(t)}
                  style={{ cursor: 'pointer' }}
                >
                  ×
                </span>
              </div>
            ))}
          </div>

          <input
            ref={tagInputRef}
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKey}
            placeholder="Press Enter to add tag"
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: 8,
              border: '1px solid var(--border)'
            }}
          />
        </div>

        {/* CONTENT */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note..."
          style={{
            width: '100%',
            minHeight: 160,
            padding: '12px',
            borderRadius: 10,
            border: '1px solid var(--border)',
            resize: 'vertical',
            background: selectedColor || 'var(--note-bg)',
            color: getContrastYIQ(selectedColor || '#fff')
          }}
        />

        {/* ACTIONS */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 10,
          marginTop: 4   // ✅ REMOVED EXTRA BOTTOM GAP
        }}>
          <button
            onClick={handleDiscard}
            style={{
              border: '1px solid var(--border)',
              background: 'transparent',
              padding: '8px 14px',
              borderRadius: 8,
              cursor: 'pointer'
            }}
          >
            Discard
          </button>

          <button
            onClick={handleSave}
            style={{
              background: 'linear-gradient(135deg,#e53935,#ff3b30)',
              color: '#fff',
              border: 'none',
              padding: '8px 14px',
              borderRadius: 8,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Save
          </button>
        </div>

      </div>
    </Modal>
  )
}

export default NoteEditorModal