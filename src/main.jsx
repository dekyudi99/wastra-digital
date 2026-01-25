import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
import idID from 'antd/locale/id_ID'
import App from './App.jsx'
import { wastraTheme } from './utils/antdTheme'
import './styles/index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryclient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider locale={idID} theme={wastraTheme}>
      <QueryClientProvider client={queryclient}>
        <ReactQueryDevtools initialIsOpen={false}></ReactQueryDevtools>
        <App />
      </QueryClientProvider>
    </ConfigProvider>
  </React.StrictMode>,
)

