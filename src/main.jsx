import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import PayRegisterPage from './pages/Register/PayRegisterPage.jsx'
import App from './App.jsx'
import AppRouter from './routes/Router.jsx'
import { RecoilRoot } from 'recoil'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RecoilRoot>
      <AppRouter>
        <App />
      </AppRouter>
    </RecoilRoot>
  </StrictMode>,
)
