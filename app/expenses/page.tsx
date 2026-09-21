"use client"

import { useMemo, useState } from "react"
import { Navbar } from "@/components/navbar"
import { ExpenseForm } from "@/components/expense-form"
import { ExpenseTable } from "@/components/expense-table"
import { useTrips } from "@/contexts/trip-context"

export default function ExpensesPage() {
  const { trips, addExpense, deleteExpense, getExpensesByTrip } = useTrips()
  const [selectedTripId, setSelectedTripId] = useState<string>(trips[0]?.id || "1")

  const selectedTrip = trips.find((trip) => trip.id === selectedTripId)

  const handleAddExpense = (expense: any) => {
    addExpense({
      ...expense,
      tripId: selectedTripId,
    })
  }

  const handleDeleteExpense = (id: string) => {
    deleteExpense(id)
  }

  const filteredExpenses = useMemo(() => {
    return getExpensesByTrip(selectedTripId)
  }, [selectedTripId, getExpensesByTrip])

  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">Expenses</h1>
              <p className="text-sm sm:text-base text-muted-foreground">Manage and track all your trip expenses</p>
            </div>
            <div className="w-full sm:w-auto">
              <ExpenseForm onSubmit={handleAddExpense} participants={selectedTrip?.participants || []} />
            </div>
          </div>

          {/* Trip Selector */}
          <div className="mb-6 sm:mb-8">
            <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">Select Trip</label>
            <select
              value={selectedTripId}
              onChange={(e) => setSelectedTripId(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            >
              {trips.map((trip) => (
                <option key={trip.id} value={trip.id}>
                  {trip.name}
                </option>
              ))}
            </select>
          </div>

          {/* Summary */}
          <div className="bg-card rounded-xl p-4 sm:p-6 shadow-sm border border-border mb-6 sm:mb-8">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Total Expenses</p>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">${totalExpenses.toFixed(2)}</p>
          </div>

          {/* Table */}
          <div className="bg-card rounded-xl shadow-sm border border-border overflow-x-auto">
            <ExpenseTable expenses={filteredExpenses} onDelete={handleDeleteExpense} />
          </div>
        </div>
      </main>
    </div>
  )
}
