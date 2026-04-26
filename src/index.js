import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Root from './Root'

import { ThemeProvider } from './context/ThemeContext'
import { NotesProvider } from './context/NotesContext' 

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <NotesProvider>   {}
        <Root />
      </NotesProvider>
    </ThemeProvider>
  </React.StrictMode>
)