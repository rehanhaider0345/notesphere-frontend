import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import API_BASE from '../config/api'

const NotesContext = createContext()

export function NotesProvider({ children, user })
{
  const [notes, setNotes] = useState([])
  const [binNotes, setBinNotes] = useState([])

  const getUserId = useCallback(() => user?.user_id || user?.id, [user])

  // ================= SAFE JSON =================
  const safeJson = async (res) =>
  {
    const text = await res.text()

    try
    {
      return JSON.parse(text)
    }
    catch
    {
      console.log("INVALID JSON:", text)
      return null
    }
  }

  // ================= FORMAT =================
  const formatNote = (n) => ({
    id: n.note_id,
    title: n.title,
    contentMd: n.content,
    color: n.color,
    createdAt: n.created_at,
    updatedAt: n.updated_at,
    deletedAt: n.deleted_at || null,

    tags: Array.isArray(n.tags)
      ? n.tags
      : typeof n.tags === "string" && n.tags.length > 0
        ? n.tags.split(',').map(t => t.trim()).filter(Boolean)
        : []
  })

  // ================= FETCH NOTES =================
  const fetchNotes = useCallback(async (userId) =>
  {
    const uid = userId || getUserId()

    if (!uid)
    {
      setNotes([])
      return
    }

    try
    {
      const res = await fetch(`${API_BASE}/get_notes.php?user_id=${uid}`)
      const data = await safeJson(res)

      if (!Array.isArray(data))
      {
        setNotes([])
        return
      }

      setNotes(data.map(formatNote))
    }
    catch (err)
    {
      console.log("FETCH NOTES ERROR:", err)
      setNotes([])
    }
  }, [getUserId])

  // ================= FETCH BIN =================
  const fetchBinNotes = useCallback(async (userId) =>
  {
    const uid = userId || getUserId()

    if (!uid)
    {
      setBinNotes([])
      return
    }

    try
    {
      const res = await fetch(`${API_BASE}/get_bin_notes.php?user_id=${uid}`)
      const data = await safeJson(res)

      console.log("BIN DATA:", data)

      if (!Array.isArray(data))
      {
        setBinNotes([])
        return
      }

      setBinNotes(data.map(formatNote))
    }
    catch (err)
    {
      console.log("BIN ERROR:", err)
      setBinNotes([])
    }
  }, [getUserId])

  // ================= LOAD =================
  useEffect(() =>
  {
    const uid = getUserId()

    if (uid)
    {
      fetchNotes(uid)
      fetchBinNotes(uid)
    }
    else
    {
      setNotes([])
      setBinNotes([])
    }
  }, [fetchNotes, fetchBinNotes, getUserId])

  // ================= ADD =================
  const addNote = async (note) =>
  {
    const uid = getUserId()
    if (!uid) return

    await fetch(`${API_BASE}/add_note.php`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: uid,
        title: note.title,
        content: note.contentMd,
        color: note.color,
        tags: note.tags || []
      })
    })

    await fetchNotes(uid)
  }

  // ================= UPDATE =================
  const updateNote = async (id, updated) =>
  {
    const uid = getUserId()

    await fetch(`${API_BASE}/update_note.php`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        note_id: id,
        title: updated.title,
        content: updated.contentMd,
        color: updated.color,
        tags: updated.tags || []
      })
    })

    await fetchNotes(uid)
  }

  // ================= DELETE =================
  const deleteNote = async (noteId) =>
  {
    const uid = getUserId()

    try
    {
      console.log("Deleting note:", noteId)

      const res = await fetch(`${API_BASE}/delete_note.php`,
      {
        method: "POST",
        headers:
        {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          note_id: noteId
        })
      })

      const text = await res.text()
      console.log("DELETE RESPONSE:", text)

      let data

      try
      {
        data = JSON.parse(text)
      }
      catch
      {
        console.log("Invalid JSON:", text)
        return
      }

      if (data.status === "success")
      {
        setNotes(prev => prev.filter(n => n.id !== noteId))

        await fetchBinNotes(uid)

        console.log("Deleted ✅")
      }
      else
      {
        console.log("Delete failed:", data.message)
      }
    }
    catch (err)
    {
      console.log("DELETE ERROR:", err)
    }
  }

  // ================= RESTORE =================
  const restoreNote = async (id) =>
  {
    const uid = getUserId()

    await fetch(`${API_BASE}/restore_note.php`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note_id: id })
    })

    await fetchNotes(uid)
    await fetchBinNotes(uid)
  }

  // ================= DELETE FOREVER =================
  const deleteForever = async (id) =>
  {
    const uid = getUserId()

    await fetch(`${API_BASE}/permanent_delete.php`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note_id: id })
    })

    await fetchNotes(uid)
    await fetchBinNotes(uid)
  }

  // ================= CONTEXT =================
  return (
    <NotesContext.Provider value={{
      notes,
      binNotes,
      addNote,
      updateNote,
      deleteNote,
      restoreNote,
      deleteForever,
      fetchBinNotes,
      refreshNotes: fetchNotes
    }}>
      {children}
    </NotesContext.Provider>
  )
}

export const useNotes = () => useContext(NotesContext)
