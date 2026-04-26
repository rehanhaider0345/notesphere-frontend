import React from 'react'
import App from './App'
import Auth from './Auth'
import { NotesProvider } from './context/NotesContext'
import { ThemeProvider } from './context/ThemeContext'

export default function Root()
{
  const [user, setUser] = React.useState(
    JSON.parse(localStorage.getItem("user"))
  )

  return (
    <ThemeProvider>
      <NotesProvider user={user}>
        {user ? (
          <App user={user} setUser={setUser} />
        ) : (
          <Auth onAuthSuccess={setUser} />
        )}
      </NotesProvider>
    </ThemeProvider>
  )
}