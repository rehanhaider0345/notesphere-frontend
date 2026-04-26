import React from 'react'
import NoteCard from './NoteCard'

function NoteList({ 
  notes, 
  onCardClick, 
  hoveredNoteId, 
  setHoveredNoteId, 
  onDragStart, 
  onDragEnd, 
  draggingId,
  onTagClick 
}) {
  if (!notes.length) {
    return <p style={{ opacity: 0.7 }}>No notes found.</p>
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem'
      }}
    >
      {notes.map(note => {
        const isBlurred = hoveredNoteId !== null && hoveredNoteId !== note.id
        
        return (
          <NoteCard
            key={note.id}
            note={note}
            onClick={() => onCardClick(note.id)}
            isBlurred={isBlurred}
            onMouseEnter={() => setHoveredNoteId(note.id)}
            onMouseLeave={() => setHoveredNoteId(null)}
            onDragStart={() => onDragStart(note.id)}
            onDragEnd={onDragEnd}
            draggingId={draggingId}
            onTagClick={onTagClick} 
          />
        )
      })}
    </div>
  )
}

export default NoteList