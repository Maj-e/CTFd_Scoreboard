import { useEffect, useRef, useState } from 'react'
import { fetchScoreboard } from './api/scoreboardApi'
import ctfBackground from './assets/FONDO-CTF-CIBER-42MLG.png'
import CoalitionScoreBanner from './components/CoalitionScoreBanner'
import { TEAM_THEMES, getTeamTheme } from './utils/teamThemes'
import { compareWithPreviousScores, getTeamScores, resetScoreCache } from './utils/scoreboardDiff'
import './App.css'

const MAX_SCORE = 2000

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

const COALITIONS = ['hades', 'void', 'olympus']

function ScoreboardTeams({ data = [] }) {
  const mapByName = new Map((data || []).map(t => [String(t.name || '').trim().toLowerCase(), t]))

  return (
    <div className="scoreboard-columns">
      <div className="side-panel" />
      {COALITIONS.map((coal) => {
        const found = mapByName.get(coal)
        const team = found
          ? found
          : { name: (TEAM_THEMES[coal]?.name ?? coal).toString(), score: 0 }
        const theme = getTeamTheme(team.name)

        return (
          <article
            className="team-column"
            key={coal}
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
              <TeamGauge score={Number(team.score) || 0} maxScore={MAX_SCORE} accent={theme.accent} />
            </div>
          </article>
        )
      })}
      <div className="side-panel" />
    </div>
  )
}

function App() {
  const [scoreboard, setScoreboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [bannerEvent, setBannerEvent] = useState(null)
  const bannerSequenceRef = useRef(0)
  const bannerQueueRef = useRef([])
  const bannerActiveRef = useRef(false)
  const hideTimerRef = useRef(null)
  const appShellStyle = {
    '--app-background-image': `url(${ctfBackground})`,
  }

  const showNextBanner = () => {
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current)
      hideTimerRef.current = null
    }

    const nextEvent = bannerQueueRef.current.shift()

    if (!nextEvent) {
      bannerActiveRef.current = false
      setBannerEvent(null)
      return
    }

    bannerActiveRef.current = true
    setBannerEvent(nextEvent)

    hideTimerRef.current = window.setTimeout(() => {
      setBannerEvent(null)
      showNextBanner()
    }, 4000)
  }

  const queueBanner = (teamName, points, accent, logo) => {
    const nextSequence = bannerSequenceRef.current + 1
    bannerSequenceRef.current = nextSequence

    bannerQueueRef.current.push({
      teamName,
      points,
      accent,
      logo,
      sequence: nextSequence,
    })

    if (!bannerActiveRef.current) {
      showNextBanner()
    }
  }

  useEffect(() => {
    let cancelled = false

    const loadScoreboard = async () => {
      try {
        const data = await fetchScoreboard()

        if (cancelled) {
          return
        }

        const currentScores = getTeamScores(data?.data ?? [])

        const scoreIncreases = compareWithPreviousScores(currentScores)

        if (scoreIncreases.length > 0) {
          for (const increase of scoreIncreases) {
            const teamTheme = getTeamTheme(
              data?.data?.find(team => String(team?.name ?? '').trim().toLowerCase() === increase.teamKey)?.name,
            )

            queueBanner(teamTheme.name, increase.points, teamTheme.accent, teamTheme.logo)
          }
        }

        setScoreboard(data)
        setError(null)
      } catch (err) {
        if (cancelled) {
          return
        }

        setError(err)
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadScoreboard()
    const intervalId = window.setInterval(loadScoreboard, 1000)

    return () => {
      cancelled = true
      window.clearInterval(intervalId)

      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current)
      }

      bannerQueueRef.current = []
      bannerActiveRef.current = false

      resetScoreCache()
    }
  }, [])

  const teams = scoreboard?.data ?? []

  if (loading) {
    return (
      <main className="app-shell" style={appShellStyle}>
        <p className="status">Loading...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="app-shell" style={appShellStyle}>
        <p className="status status--error">Error: {error.message}</p>
      </main>
    )
  }

  return (
    <main className="app-shell app-shell--fullscreen" style={appShellStyle}>
      <CoalitionScoreBanner event={bannerEvent} />
      <ScoreboardTeams data={teams} />
    </main>
  )
}

export default App
