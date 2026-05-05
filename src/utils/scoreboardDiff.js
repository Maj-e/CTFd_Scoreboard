let previousScoresCache = new Map()

function toTeamKey(teamName) {
  return String(teamName ?? '').trim().toLowerCase()
}

export function getTeamScores(teams = []) {
  const scores = new Map()

  for (const team of teams) {
    scores.set(toTeamKey(team?.name), Number(team?.score) || 0)
  }

  return scores
}

export function findScoreChanges(previousScores, currentScores) {
  const events = []

  for (const [teamKey, currentScore] of currentScores.entries()) {
    const previousScore = previousScores.get(teamKey) ?? 0
    const delta = currentScore - previousScore

    if (delta !== 0) {
      events.push({
        teamKey,
        delta,
      })
    }
  }

  return events
}

export function compareWithPreviousScores(currentScores) {
  const scoreChanges = findScoreChanges(previousScoresCache, currentScores)
  previousScoresCache = new Map(currentScores)

  return scoreChanges
}

export function resetScoreCache(initialScores = new Map()) {
  previousScoresCache = new Map(initialScores)
}