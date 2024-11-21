'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { User } from 'lucide-react'

interface PlayerData {
  id: number
  fullName: string
  pic: string
  goals?: number
  goalLabel?: string
}

interface PersonData {
  name: string
  players: PlayerData[]
  totalGoals?: number // New property to store total goals
}

export function BluesGoalsDashboardComponent() {
  const [data, setData] = useState<PersonData[]>([
    { name: 'Kevin', players: [] },
    { name: 'Rob', players: [] },
    { name: 'Matt', players: [] }
  ])
  const [loading, setLoading] = useState(true)

  const fetchPlayerGoals = async (playerId: number): Promise<{ goals: number, goalLabel: string }> => {
    try {
      const response = await fetch(`/api/player-goals?playerId=${playerId}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return { goals: data.goals, goalLabel: data.goalLabel }
    } catch (error) {
      console.error(`Error fetching goals for player ${playerId}:`, error)
      return { goals: 0, goalLabel: 'goals' }
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mockData: PersonData[] = [
          {
            name: 'Kevin',
            players: [
              { id: 8482089, fullName: 'Jake Neighbors', pic: 'neighbours.png' },
              { id: 8480023, fullName: 'Robert Thomas', pic: 'thomas.jfif' },
              { id: 8481598, fullName: 'Phillip Broberg', pic: 'broberg.jpg' },
              
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
            const { goals, goalLabel } = await fetchPlayerGoals(player.id)
            return { ...player, goals, goalLabel }
          }))
          const totalGoals = playersWithGoals.reduce((sum, player) => sum + (player.goals || 0), 0)
          return { 
            ...person, 
            players: playersWithGoals, 
            totalGoals: person.name === 'Kevin' ? totalGoals + 2 : totalGoals 
          }
        }))

        // Sort the data by total goals, from most to least
        const sortedData = dataWithGoals.sort((a, b) => (b.totalGoals || 0) - (a.totalGoals || 0))

        setData(sortedData)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-[#041E42] p-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-[#FCB514]">
        St. Louis Blues Goals Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {data.map((person, index) => (
          <Card key={index} className="w-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-[#0082CA] rounded-lg">
            <CardHeader className="border-b border-[#0082CA] bg-[#003087] rounded-t-lg">
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
                    {person.totalGoals}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {person.players.map((player) => (
                      <div key={player.id} className="text-center">
                        <div className="w-16 h-16 mx-auto mb-2 relative">
                          <img 
                            src={`/${player.pic}`} 
                            alt={player.fullName} 
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                        <p className="text-sm mt-1">{player.fullName}</p>
                        <p className="text-sm font-bold">{player.goals} {player.goalLabel}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="w-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-[#0082CA] mt-8 rounded-lg">
        <CardHeader className="border-b border-[#0082CA] bg-[#003087] rounded-t-lg">
          <CardTitle className="text-xl text-white">
            Changelog
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ul className="list-disc list-inside">
            <li>11/20/24 - Added Kevin&apos;s 2 goals to his total for Schenn while Thomas was on the IR</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
