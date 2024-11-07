import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './contexts/authContext/index.jsx'
import { RecoilRoot } from 'recoil'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RecoilRoot>
        <AuthProvider>
            <App />
        </AuthProvider>
    </RecoilRoot>
  </React.StrictMode>,
)