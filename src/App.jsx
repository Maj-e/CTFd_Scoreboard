import { useEffect, useState } from 'react'
import { fetchScoreboard } from './api/scoreboardApi'
import './App.css'

function ScoreboardTeams({ data = [] }) {
  if (!data.length) {
    return <p className="empty-state">No teams to display.</p>
  }

  return (
    <div className="scoreboard-grid">
      {data.map((team, index) => (
        <article className="team-card" key={team.account_id ?? team.id ?? index}>
          <div className="team-card__rank">#{team.pos ?? index + 1}</div>
          <div className="team-card__content">
            <h2 className="team-card__name">{team.name}</h2>
            <p className="team-card__score">{team.score} points</p>
          </div>
        </article>
      ))}
    </div>
  )
}

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

  const teams = scoreboard?.data ?? []

  return (
    <main className="app-shell">
      <section className="hero">
        <p className="eyebrow">CTFd Scoreboard</p>
        <h1>Team Rankings</h1>
        <p className="hero__subtitle">
          All teams and their current scores are displayed below.
        </p>
      </section>

      {loading && <p className="status">Loading...</p>}
      {error && <p className="status status--error">Error: {error.message}</p>}

      {!loading && !error && <ScoreboardTeams data={teams} />}
    </main>
  )
}

export default App
