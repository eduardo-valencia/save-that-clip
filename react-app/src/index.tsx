import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import CssBaseline from '@mui/material/CssBaseline'
import reportWebVitals from './reportWebVitals'

let rootElement: HTMLElement

const createRoot = (): HTMLElement => {
  const rootElement = document.createElement('div')
  rootElement.id = 'save-that-clip'
  document.body.appendChild(rootElement)
  return rootElement
}

const createStyles = (): void => {
  const element = document.createElement('style')
  rootElement.appendChild(element)
}

rootElement = createRoot()
createStyles()
const root = ReactDOM.createRoot(rootElement)

root.render(
  <React.StrictMode>
    <CssBaseline />
    <App />
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
