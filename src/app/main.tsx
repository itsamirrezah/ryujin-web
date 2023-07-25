import { RouterProvider } from '@tanstack/router'
import React from 'react'
import ReactDOM from 'react-dom/client'
import './global.css'
import { router } from "@/lib/router"
import { GoogleOAuthProvider } from '@react-oauth/google'
import AuthContextProvider from '@/lib/auth'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthContextProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
        <RouterProvider router={router} />
      </GoogleOAuthProvider>
    </AuthContextProvider>
  </React.StrictMode>,
)
