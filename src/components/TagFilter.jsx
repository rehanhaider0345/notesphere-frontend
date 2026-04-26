import React from 'react'

function TagFilter({ allTags, selectedTags, onTagToggle }) {
  return (
    <div style={{ marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      <span style={{ fontWeight: 600, marginRight: '1rem' }}>Filter by tags:</span>
      {allTags.map(tag => (
        <button
          key={tag}
          onClick={() => onTagToggle(tag)}
          style={{
            padding: '0.4rem 0.8rem',
            borderRadius: '20px',
            border: selectedTags.includes(tag) ? '2px solid #ff8800' : '1px solid var(--border)',
            background: selectedTags.includes(tag) ? '#ff880020' : 'var(--note-bg)',
            color: 'var(--text)',
            cursor: 'pointer',
            fontWeight: 500,
            transition: 'all 0.2s'
          }}
        >
          {tag}
        </button>
      ))}
      {selectedTags.length > 0 && (
        <button
          onClick={() => onTagToggle(null)}
          style={{
            padding: '0.4rem 0.8rem',
            borderRadius: '20px',
            border: '1px solid var(--border)',
            background: 'transparent',
            color: 'var(--text)',
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          Clear all
        </button>
      )}
    </div>
  )
}

export default TagFilter