'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { User } from 'lucide-react'

interface PlayerData {
  id: number
  fullName: string
  pic: string
  goals?: number
}

interface PersonData {
  name: string
  players: PlayerData[]
}

export function BluesGoalsDashboardComponent() {
  const [data, setData] = useState<PersonData[]>([
    { name: 'Kevin', players: [] },
    { name: 'Rob', players: [] },
    { name: 'Matt', players: [] }
  ])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mockData: PersonData[] = [
          {
            name: 'Kevin',
            players: [
              { id: 8482089, fullName: 'Jake Neighbors', pic: 'neighbours.png' },
              { id: 8480023, fullName: 'Robert Thomas', pic: 'thomas.jfif' },
              { id: 8481598, fullName: 'Phillip Broberg', pic: 'broberg.jpg' }
            ]
          },
          {
            name: 'Rob',
            players: [
              { id: 8479385, fullName: 'Jordan Kyrou', pic: 'kyrou.png' },
              { id: 8482077, fullName: 'Dylan Holloway', pic: 'holloway.jpg' },
              { id: 8475753, fullName: 'Justin Faulk', pic: 'faulk.png' }
            ]
          },
          {
            name: 'Matt',
            players: [
              { id: 8477402, fullName: 'Pavel Buchnevich', pic: 'buchnevich.png' },
              { id: 8476438, fullName: 'Brandon Saad', pic: 'saad.png' },
              { id: 8476892, fullName: 'Colton Parayko', pic: 'parayko.png' }
            ]
          }
        ]

        const dataWithGoals = await Promise.all(mockData.map(async (person) => {
          const playersWithGoals = await Promise.all(person.players.map(async (player) => {
            const goals = await fetchPlayerGoals(player.id)
            return { ...player, goals }
          }))
          return { ...person, players: playersWithGoals }
        }))

        setData(dataWithGoals)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const fetchPlayerGoals = async (playerId: number): Promise<number> => {
    try {
      const response = await fetch(`/api/player-goals?playerId=${playerId}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (data.error) {
        throw new Error(data.error)
      }
      return data.goals
    } catch (error) {
      console.error(`Error fetching goals for player ${playerId}:`, error)
      return 0
    }
  }

  return (
    <div className="min-h-screen bg-[#041E42] p-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-[#FCB514]">
        St. Louis Blues Goals Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {data.map((person, index) => (
          <Card key={index} className="w-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-[#0082CA]">
            <CardHeader className="border-b border-[#0082CA] bg-[#003087]">
              <CardTitle className="text-2xl flex items-center gap-2 text-white">
                <User className="h-6 w-6 text-[#FCB514]" />
                {person.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {loading ? (
                <Skeleton className="h-[200px] w-full bg-[#E6E6E6]" />
              ) : (
                <>
                  <div className="text-6xl font-bold text-center text-[#003087] mb-4">
                    {person.players.reduce((sum, player) => sum + (player.goals || 0), 0)}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {person.players.map((player) => (
                      <div key={player.id} className="text-center">
                        <img 
                          src={`/${player.pic}`} 
                          alt={player.fullName} 
                          className="w-16 h-16 mx-auto rounded-full object-cover"
                        />
                        <p className="text-sm mt-1">{player.fullName}</p>
                        <p className="text-sm font-bold">{player.goals} goals</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
