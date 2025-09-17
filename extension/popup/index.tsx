import React from 'react'
import ReactDOM from 'react-dom/client'
import '@/styles/globals.css'

function Popup() {
  return (
    <div className="min-w-[400px] min-h-[500px] p-4">
      <h1 className="text-2xl font-bold mb-4">TabZen</h1>
      <p className="text-muted-foreground">
        Chrome extension for intelligent tab management
      </p>
      <div className="mt-4">
        <p className="text-sm">Coming soon...</p>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
)