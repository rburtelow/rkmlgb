'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { User } from 'lucide-react'

interface PlayerData {
  id: number
  fullName: string
  goals: number
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
              { id: 8479314, fullName: 'Jordan Kyrou', goals: 37 },
              { id: 8476468, fullName: 'Brayden Schenn', goals: 21 },
              { id: 8475170, fullName: 'Pavel Buchnevich', goals: 26 }
            ]
          },
          {
            name: 'Rob',
            players: [
              { id: 8477956, fullName: 'Robert Thomas', goals: 22 },
              { id: 8474157, fullName: 'Brandon Saad', goals: 19 },
              { id: 8475158, fullName: 'Justin Faulk', goals: 11 }
            ]
          },
          {
            name: 'Matt',
            players: [
              { id: 8474565, fullName: 'Torey Krug', goals: 7 },
              { id: 8476412, fullName: 'Colton Parayko', goals: 5 },
              { id: 8478407, fullName: 'Sammy Blais', goals: 9 }
            ]
          }
        ]

        await new Promise(resolve => setTimeout(resolve, 1000))

        setData(mockData)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getMaxGoals = (players: PlayerData[]) => {
    return Math.max(...players.map(player => player.goals))
  }

  return (
    <div className="min-h-screen bg-[#041E42] p-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-[#FCB514]">
        St. Louis Blues Goals Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  <div className="text-6xl font-bold text-center mb-6 text-[#003087]">
                    {person.players.reduce((sum, player) => sum + player.goals, 0)}
                  </div>
                  <ul className="space-y-4">
                    {person.players.map((player) => (
                      <li key={player.id} className="space-y-2">
                        <div className="flex justify-between items-center text-[#041E42]">
                          <span className="flex items-center gap-2">
                            <img
                              src={`/placeholder.svg?height=32&width=32`}
                              alt={`${player.fullName} avatar`}
                              className="w-8 h-8 rounded-full"
                            />
                            {player.fullName}
                          </span>
                          <span className="font-semibold">{player.goals}</span>
                        </div>
                        <Progress 
                          value={(player.goals / getMaxGoals(person.players)) * 100} 
                          className="h-2 bg-[#E6E6E6]"
                          indicatorClassName="bg-gradient-to-r from-[#003087] to-[#0082CA]"
                        />
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}