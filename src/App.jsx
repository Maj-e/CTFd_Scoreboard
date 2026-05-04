import { useState, useEffect } from 'react'
import { fetchScoreboard } from './api/scoreboardApi'
import './App.css'

function App() {
  const [scoreboard, setScoreboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchScoreboard()
      .then(data => {
        setScoreboard(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="app">
      <h1>Scoreboard</h1>
      
      {loading && <p>Chargement...</p>}
      {error && <p style={{color: 'red'}}>Erreur: {error.message}</p>}
      
      {scoreboard && (
        <pre>{JSON.stringify(scoreboard, null, 2)}</pre>
      )}
    </div>
  )
}

export default App
