import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="681010265618-lk2n2lr84pq4l12rnopndkkfku0p4pc6.apps.googleusercontent.com">
    <App />
    </GoogleOAuthProvider>
  </StrictMode>,
  // 296706623430-frrf4nlllv1k1fk3iprthc54fr2r4rsn.apps.googleusercontent.com
)
