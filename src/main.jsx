import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { SubjectProvider } from './context/SubjectContext'
import { PurchaseProvider } from './context/PurchaseContext'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SubjectProvider>
          <PurchaseProvider>
            <App />
          </PurchaseProvider>
        </SubjectProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
