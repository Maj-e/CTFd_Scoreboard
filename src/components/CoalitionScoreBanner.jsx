import './CoalitionScoreBanner.css'
import trumpetSound from '../assets/trumpet.mp3';
import oofSound from '../assets/oof.mp3';
import { useEffect } from 'react';

export default function CoalitionScoreBanner({ event }) {

  useEffect(() => {
    if (!event) return;
    let audio;
    if (event.action === 'scored') {
      audio = new Audio(trumpetSound);
      audio.play();
    } else if (event.action === 'spent') {
      audio = new Audio(oofSound);
      audio.play();
    }
    // Pas besoin de nettoyer car le son est court
  }, [event]);

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
        {event.teamName} {event.action} {event.points} points
      </span>
    </div>
  )
}