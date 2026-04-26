import React, { useState } from 'react'
import { getContrastYIQ } from '../utils/colorUtils'

function NoteCard({
  note,
  onClick,
  isBlurred,
  onMouseEnter = () => {},
  onMouseLeave = () => {},
  onDragStart,
  onDragEnd,
  draggingId,
  onTagClick
})
{
  const accent = note.color || '#75cbf3'
  const contrastText = getContrastYIQ(accent)
  const isDragging = draggingId === note.id

  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const pillBg =
    contrastText === '#000'
      ? 'rgba(255,255,255,0.85)'
      : 'rgba(0,0,0,0.18)'

  const pillBorder =
    contrastText === '#000'
      ? 'rgba(0,0,0,0.08)'
      : 'rgba(255,255,255,0.14)'

  const pillTextColor =
    contrastText === '#000'
      ? '#111'
      : '#fff'

  const openNote = (e) =>
  {
    if (e?.defaultPrevented) return
    onClick?.()
  }

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={note.title ? `Open note ${note.title}` : 'Open note'}
      draggable

      // ================= DRAG FIX (FINAL CORRECT) =================
      onDragStart={(e) =>
      {
        if (onDragStart)
        {
          onDragStart(note.id)
        }

        // 🔥 CRITICAL FIX (MATCH FloatingBin)
        e.dataTransfer.setData("noteId", note.id)
        e.dataTransfer.effectAllowed = "move"
      }}

      onDragEnd={() =>
      {
        if (onDragEnd)
        {
          onDragEnd()
        }
      }}

      // ================= OPEN NOTE =================
      onClick={openNote}

      onKeyDown={(e) =>
      {
        if (e.key === 'Enter' || e.key === ' ')
        {
          e.preventDefault()
          openNote()
        }
      }}

      onFocus={() =>
      {
        setIsFocused(true)
        onMouseEnter?.()
      }}

      onBlur={() =>
      {
        setIsFocused(false)
        onMouseLeave?.()
      }}

      onMouseEnter={() =>
      {
        setIsHovered(true)
        onMouseEnter?.()
      }}

      onMouseLeave={() =>
      {
        setIsHovered(false)
        onMouseLeave?.()
      }}

      style={{
        background: accent,
        color: contrastText,
        borderRadius: 12,
        padding: 16,
        minHeight: 120,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',

        boxShadow: isFocused
          ? '0 6px 24px rgba(0,0,0,0.12)'
          : isHovered
            ? '0 8px 28px rgba(0,0,0,0.08)'
            : '0 2px 10px rgba(0,0,0,0.04)',

        transform: isDragging
          ? 'scale(1.03) rotate(-1deg)'
          : isHovered
            ? 'translateY(-4px)'
            : 'none',

        transition: 'all 0.18s ease',

        filter: isBlurred && !isHovered
          ? 'blur(2px) brightness(0.92)'
          : 'none',

        cursor: isDragging ? 'grabbing' : 'pointer',

        outline: isFocused
          ? '3px solid rgba(255,136,0,0.18)'
          : 'none',

        position: 'relative',
        overflow: 'hidden'
      }}
    >

      {/* TITLE + TAGS */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 8
      }}>

        <h3 style={{
          margin: 0,
          fontSize: 18,
          fontWeight: 700,
          flex: 1,
          wordBreak: 'break-word'
        }}>
          {note.title || <span style={{ opacity: 0.7 }}>Untitled</span>}
        </h3>

        <div style={{
          display: 'flex',
          gap: 6,
          flexWrap: 'wrap',
          maxWidth: '40%'
        }}>
          {note.tags?.map(tag => (
            <button
              key={tag}
              onClick={(e) =>
              {
                e.stopPropagation()
                onTagClick?.(tag)
              }}
              style={{
                background: pillBg,
                color: pillTextColor,
                border: `1px solid ${pillBorder}`,
                borderRadius: 999,
                padding: '4px 8px',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              #{tag}
            </button>
          ))}
        </div>

      </div>

      {/* CONTENT */}
      <div style={{
        fontSize: 15,
        opacity: 0.9,
        marginBottom: 12
      }}>
        {note.contentMd
          ? note.contentMd.slice(0, 140) +
            (note.contentMd.length > 140 ? '…' : '')
          : <span style={{ opacity: 0.6 }}>(No content)</span>}
      </div>

      {/* FOOTER */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 12,
        opacity: 0.8
      }}>
        {note.updatedAt
          ? new Date(note.updatedAt).toLocaleString()
          : new Date(note.createdAt).toLocaleString()}
      </div>

    </article>
  )
}

export default React.memo(NoteCard)