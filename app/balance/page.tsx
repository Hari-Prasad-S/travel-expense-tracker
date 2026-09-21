"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { useTrips } from "@/contexts/trip-context"
import { ArrowRight } from "lucide-react"

export default function BalancePage() {
  const { trips, calculateBalances } = useTrips()
  const [selectedTripId, setSelectedTripId] = useState<string>(trips[0]?.id || "")

  const selectedTrip = trips.find((t) => t.id === selectedTripId)
  const balances = selectedTrip ? calculateBalances(selectedTripId) : {}

  const getSettlements = () => {
    if (!selectedTrip) return []

    const settlements: Array<{ from: string; to: string; amount: number }> = []
    const balancesCopy = { ...balances }

    selectedTrip.participants.forEach((participant) => {
      const balance = balancesCopy[participant.id] || 0

      if (balance < 0) {
        selectedTrip.participants.forEach((creditor) => {
          const creditorBalance = balancesCopy[creditor.id] || 0
          if (creditorBalance > 0 && balance < 0) {
            const amount = Math.min(Math.abs(balance), creditorBalance)
            settlements.push({
              from: participant.name,
              to: creditor.name,
              amount,
            })
            balancesCopy[participant.id] += amount
            balancesCopy[creditor.id] -= amount
          }
        })
      }
    })

    return settlements
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Balance Sheet</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Track who owes whom in your trips</p>
          </div>

          {/* Trip Selector */}
          <div className="mb-6 sm:mb-8">
            <label className="block text-sm font-medium text-foreground mb-2">Select Trip</label>
            <select
              value={selectedTripId}
              onChange={(e) => setSelectedTripId(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {trips.map((trip) => (
                <option key={trip.id} value={trip.id}>
                  {trip.name} - {trip.destination}
                </option>
              ))}
            </select>
          </div>

          {selectedTrip && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Participant Balances */}
              <div className="bg-card rounded-xl shadow-sm border border-border p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4">Participant Balances</h2>
                <div className="space-y-3">
                  {selectedTrip.participants.map((participant) => {
                    const balance = balances[participant.id] || 0
                    const isPositive = balance > 0
                    const isNegative = balance < 0

                    return (
                      <div
                        key={participant.id}
                        className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-muted border border-border"
                      >
                        <div>
                          <p className="font-medium text-foreground text-sm sm:text-base">{participant.name}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">{participant.email}</p>
                        </div>
                        <div
                          className={`text-right font-bold text-sm sm:text-base ${
                            isPositive ? "text-green-600" : isNegative ? "text-red-600" : "text-foreground"
                          }`}
                        >
                          {isPositive && "+"}
                          {selectedTrip.currency}
                          {Math.abs(balance).toFixed(2)}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Settlements */}
              <div className="bg-card rounded-xl shadow-sm border border-border p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4">Settlements</h2>
                <div className="space-y-3">
                  {getSettlements().length > 0 ? (
                    getSettlements().map((settlement, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-muted border border-border"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="font-medium text-foreground text-sm sm:text-base truncate">
                            {settlement.from}
                          </span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <span className="font-medium text-foreground text-sm sm:text-base truncate">
                            {settlement.to}
                          </span>
                        </div>
                        <div className="font-bold text-sm sm:text-base text-blue-600 flex-shrink-0 ml-2">
                          {selectedTrip.currency}
                          {settlement.amount.toFixed(2)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground text-sm py-4">All settled up!</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
