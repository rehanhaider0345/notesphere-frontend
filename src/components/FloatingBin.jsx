import React from 'react'

function FloatingBin({ onClick, onDrop, isActive })
{
  return (
    <div
      onClick={onClick}
      
      onDragOver={(e) =>
      {
        e.preventDefault()
      }}

      onDrop={(e) =>
      {
        e.preventDefault()

        console.log("DROP DETECTED ✅")

        const noteId = e.dataTransfer.getData("noteId")

        console.log("Dropped note:", noteId)

        if (noteId && onDrop)
        {
          onDrop(noteId)
        }
      }}

      style={{
        position: 'fixed',
        bottom: 25,
        right: 25,
        width: 70,
        height: 70,
        borderRadius: '50%',
        background: isActive
          ? 'linear-gradient(135deg,#e53935,#ff6b6b)'
          : '#222',

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
        fontSize: 24,
        cursor: 'pointer',
        zIndex: 999999,

        boxShadow: '0 10px 25px rgba(0,0,0,0.35)'
      }}
    >
      🗑
    </div>
  )
}

export default FloatingBin