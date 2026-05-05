import './CoalitionScoreBanner.css'

export default function CoalitionScoreBanner({ event }) {
  if (!event) {
    return null
  }

  return (
    <div
      className="coalition-score-banner"
      role="status"
      aria-live="polite"
      key={`${event.teamName}-${event.points}-${event.sequence}`}
      style={{ '--banner-accent': event.accent || '#fbbf24' }}
    >
      {event.logo && (
        <img
          src={event.logo}
          alt={`${event.teamName} logo`}
          className="coalition-score-banner__logo"
        />
      )}
      <span className="coalition-score-banner__label">
        {event.teamName} scored {event.points} points
      </span>
    </div>
  )
}