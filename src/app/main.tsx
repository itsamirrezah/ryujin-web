import { RouterProvider } from '@tanstack/router'
import React from 'react'
import ReactDOM from 'react-dom/client'
import './global.css'
import { router } from "@/lib/router"

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
        <RouterProvider router={router} />
  </React.StrictMode>,
)
