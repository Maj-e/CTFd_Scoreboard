import { useEffect, useState } from 'react'
import { fetchScoreboard } from './api/scoreboardApi'
import hadesLogo from './assets/Icono_Hades_2.svg'
import olympusLogo from './assets/Icono_Olympus_2.svg'
import voidLogo from './assets/Icono_Void_2.svg'
import './App.css'

const MAX_SCORE = 2000

const TEAM_THEMES = {
  hades: {
    name: 'Hades',
    accent: '#ef4444',
    accentSoft: 'rgba(239, 68, 68, 0.18)',
    logo: hadesLogo,
  },
  void: {
    name: 'Void',
    accent: '#8b5cf6',
    accentSoft: 'rgba(139, 92, 246, 0.18)',
    logo: voidLogo,
  },
  olympus: {
    name: 'Olympus',
    accent: '#3b82f6',
    accentSoft: 'rgba(59, 130, 246, 0.18)',
    logo: olympusLogo,
  },
}

const DEFAULT_TEAM_THEME = {
  accent: '#fbbf24',
  accentSoft: 'rgba(251, 191, 36, 0.18)',
  logo: null,
}

function getTeamTheme(teamName) {
  return TEAM_THEMES[teamName?.trim().toLowerCase()] ?? DEFAULT_TEAM_THEME
}

function TeamGauge({ score, maxScore, accent }) {
  const safeScore = Number.isFinite(score) ? score : 0
  const percent = Math.max(0, Math.min(safeScore / maxScore, 1)) * 100

  return (
    <div className="team-column__gauge-wrapper" aria-label={`Score ${safeScore} out of ${maxScore}`}>
      <div className="team-column__score-display">
        <span className="team-column__score-value">{safeScore}</span>
      </div>
      <div className="team-column__gauge-track">
        <div
          className="team-column__gauge-fill"
          style={{ height: `${percent}%`, backgroundColor: accent }}
        />
      </div>
    </div>
  )
}

function ScoreboardTeams({ data = [] }) {
  if (!data.length) {
    return <p className="empty-state">No teams to display.</p>
  }

  const displayTeams = data.slice(0, 3)

  return (
    <div className="scoreboard-columns">
      {displayTeams.map((team, index) => {
        const theme = getTeamTheme(team.name)
        return (
          <article
            className="team-column"
            key={team.account_id ?? team.id ?? index}
            style={{
              '--team-accent': theme.accent,
              '--team-accent-soft': theme.accentSoft,
            }}
          >
            <div className="team-column__header">
              <div className="team-column__logo-wrap">
                {theme.logo ? (
                  <img
                    className="team-column__logo"
                    src={theme.logo}
                    alt={`${team.name} logo`}
                  />
                ) : (
                  <div className="team-column__logo team-column__logo--fallback">
                    {(team.name?.[0] ?? '?').toUpperCase()}
                  </div>
                )}
              </div>
              <div className="team-column__info">
                <h2 className="team-column__name">{team.name}</h2>
              </div>
            </div>

            <div className="team-column__gauge-container">
              <TeamGauge score={team.score} maxScore={MAX_SCORE} accent={theme.accent} />
            </div>
          </article>
        )
      })}
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

  if (loading) {
    return (
      <main className="app-shell">
        <p className="status">Loading...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="app-shell">
        <p className="status status--error">Error: {error.message}</p>
      </main>
    )
  }

  return (
    <main className="app-shell app-shell--fullscreen">
      <ScoreboardTeams data={teams} />
    </main>
  )
}

export default App
