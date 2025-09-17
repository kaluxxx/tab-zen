import React from 'react'
import ReactDOM from 'react-dom/client'
import '@/styles/globals.css'

export function Options() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">TabZen Options</h1>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Settings</h2>
          <p className="text-muted-foreground">
            Configure your tab management preferences
          </p>
        </div>
        <div className="mt-8">
          <p className="text-sm text-muted-foreground">
            More options coming soon...
          </p>
        </div>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>,
)