import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { playerId } = req.query

  if (!playerId) {
    return res.status(400).json({ error: 'Player ID is required' })
  }

  try {
    const response = await fetch(`https://api-web.nhle.com/v1/player/${playerId}/landing`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    
    // Extract goals for the current season (20242025)
    const currentSeasonGoals = data.featuredStats?.season === 20242025
      ? data.featuredStats.regularSeason?.subSeason?.goals || 0
      : 0

    // Determine the correct label based on the number of goals
    const goalLabel = currentSeasonGoals === 1 ? 'goal' : 'goals'

    res.status(200).json({ goals: currentSeasonGoals, goalLabel })
  } catch (error) {
    console.error(`Error fetching goals for player ${playerId}:`, error)
    res.status(500).json({ error: 'Failed to fetch player goals' })
  }
}
