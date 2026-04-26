import React from 'react'
import Modal from './Modal'

function ConfirmModal({
  open,
  title = "Are you sure?",
  message = "",
  confirmText = "Yes",
  cancelText = "No",
  onConfirm,
  onCancel,
  width = "380px"
}) {
  return (
    <Modal open={open} onClose={onCancel} width={width}>
      <div style={{ padding: "1rem", textAlign: "center" }}>
        <h3 style={{ marginBottom: 16 }}>{title}</h3>
        {message && <p style={{ marginBottom: 24 }}>{message}</p>}
        <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
          <button
            style={{
              background: "var(--header-bg)",
              border: "1px solid var(--border)",
              color: "var(--text)",
              borderRadius: 6,
              padding: "0.5rem 1.3rem",
              fontWeight: 600,
              cursor: "pointer"
            }}
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            style={{
              background: "#b23",
              border: "none",
              color: "#fff",
              borderRadius: 6,
              padding: "0.5rem 1.3rem",
              fontWeight: 600,
              cursor: "pointer"
            }}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmModal