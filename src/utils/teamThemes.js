import hadesLogo from '../assets/Icono_Hades_2.svg'
import olympusLogo from '../assets/Icono_Olympus_2.svg'
import voidLogo from '../assets/Icono_Void_2.svg'

export const TEAM_THEMES = {
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

export const DEFAULT_TEAM_THEME = {
  name: 'Coalition',
  accent: '#fbbf24',
  accentSoft: 'rgba(251, 191, 36, 0.18)',
  logo: null,
}

export function getTeamTheme(teamName) {
  return TEAM_THEMES[String(teamName ?? '').trim().toLowerCase()] ?? DEFAULT_TEAM_THEME
}