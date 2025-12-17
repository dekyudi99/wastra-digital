import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
import idID from 'antd/locale/id_ID'
import App from './App.jsx'
import { wastraTheme } from './utils/antdTheme'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider locale={idID} theme={wastraTheme}>
      <App />
    </ConfigProvider>
  </React.StrictMode>,
)

