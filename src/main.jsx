import React from 'react'
import ReactDOM from 'react-dom/client'
import {RecoilRoot} from 'recoil'
import {SWRConfig} from 'swr'
import App from './App'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RecoilRoot>
      <SWRConfig
        value={{
          revalidateOnFocus    : false,
          revalidateOnReconnect: false,
          revalidateIfStale    : false
        }}
      >
        <App />
      </SWRConfig>
    </RecoilRoot>
  </React.StrictMode>
)
