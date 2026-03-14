import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { AlumniProvider } from './context/AlumniContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AlumniProvider>
        <App />
      </AlumniProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
