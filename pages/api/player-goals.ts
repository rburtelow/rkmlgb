import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { playerId } = req.query

  if (!playerId) {
    return res.status(400).json({ error: 'Player ID is required' })
  }

  try {
    console.log(`Fetching data for player ${playerId}`)
    const response = await fetch(`https://api-web.nhle.com/v1/player/${playerId}/landing`)
    console.log(`Response status: ${response.status}`)
    console.log(`Response headers:`, response.headers)

    const text = await response.text()
    console.log(`Response body:`, text)

    // Then try to parse as JSON
    let data
    try {
      data = JSON.parse(text)
    } catch (parseError) {
      console.error(`Failed to parse response as JSON:`, parseError)
      throw new Error(`Invalid JSON response`)
    }

    const goals = data.featuredStats?.regularSeason?.goals || 0
    res.status(200).json({ goals })
  } catch (error) {
    console.error(`Error fetching goals for player ${playerId}:`, error)
    res.status(500).json({ error: 'Failed to fetch player goals', details: error.message })
  }
}
