"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface Participant {
  id: string
  name: string
  email: string
}

export interface Trip {
  id: string
  name: string
  destination: string
  startDate: string
  endDate: string
  budget: number
  spent: number
  currency: string
  participants: Participant[]
}

export interface ExpenseSplit {
  participantId: string
  amount: number
}

export interface Expense {
  id: string
  title: string
  amount: number
  category: string
  date: string
  tripId: string
  paidBy: string
  splitType: "equal" | "custom"
  splits: ExpenseSplit[]
}

interface TripContextType {
  trips: Trip[]
  expenses: Expense[]
  addTrip: (trip: Omit<Trip, "id" | "spent">) => void
  updateTrip: (id: string, trip: Partial<Trip>) => void
  deleteTrip: (id: string) => void
  addExpense: (expense: Omit<Expense, "id">) => void
  deleteExpense: (id: string) => void
  getExpensesByTrip: (tripId: string) => Expense[]
  calculateBalances: (tripId: string) => Record<string, number>
}

const TripContext = createContext<TripContextType | undefined>(undefined)

const initialTrips: Trip[] = [
  {
    id: "1",
    name: "Paris Adventure",
    destination: "Paris, France",
    startDate: "2024-10-14",
    endDate: "2024-10-21",
    budget: 2000,
    spent: 680,
    currency: "$",
    participants: [
      { id: "p1", name: "Alice", email: "alice@example.com" },
      { id: "p2", name: "Bob", email: "bob@example.com" },
    ],
  },
  {
    id: "2",
    name: "Tokyo Exploration",
    destination: "Tokyo, Japan",
    startDate: "2024-11-01",
    endDate: "2024-11-15",
    budget: 3000,
    spent: 260,
    currency: "¥",
    participants: [
      { id: "p3", name: "Charlie", email: "charlie@example.com" },
      { id: "p4", name: "Diana", email: "diana@example.com" },
    ],
  },
]

const initialExpenses: Expense[] = [
  {
    id: "1",
    title: "Hotel",
    amount: 150,
    category: "Accommodation",
    date: "2024-10-15",
    tripId: "1",
    paidBy: "p1",
    splitType: "equal",
    splits: [
      { participantId: "p1", amount: 75 },
      { participantId: "p2", amount: 75 },
    ],
  },
  {
    id: "2",
    title: "Flight",
    amount: 450,
    category: "Transport",
    date: "2024-10-14",
    tripId: "1",
    paidBy: "p2",
    splitType: "equal",
    splits: [
      { participantId: "p1", amount: 225 },
      { participantId: "p2", amount: 225 },
    ],
  },
]

export function TripProvider({ children }: { children: ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>(initialTrips)
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses)

  const addTrip = (trip: Omit<Trip, "id" | "spent">) => {
    const newTrip: Trip = {
      ...trip,
      id: Date.now().toString(),
      spent: 0,
    }
    setTrips([...trips, newTrip])
  }

  const updateTrip = (id: string, updates: Partial<Trip>) => {
    setTrips(trips.map((trip) => (trip.id === id ? { ...trip, ...updates } : trip)))
  }

  const deleteTrip = (id: string) => {
    setTrips(trips.filter((trip) => trip.id !== id))
    setExpenses(expenses.filter((exp) => exp.tripId !== id))
  }

  const addExpense = (expense: Omit<Expense, "id">) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
    }
    setExpenses([...expenses, newExpense])

    setTrips(trips.map((trip) => (trip.id === expense.tripId ? { ...trip, spent: trip.spent + expense.amount } : trip)))
  }

  const deleteExpense = (id: string) => {
    const expense = expenses.find((exp) => exp.id === id)
    if (expense) {
      setExpenses(expenses.filter((exp) => exp.id !== id))

      setTrips(
        trips.map((trip) =>
          trip.id === expense.tripId ? { ...trip, spent: Math.max(0, trip.spent - expense.amount) } : trip,
        ),
      )
    }
  }

  const getExpensesByTrip = (tripId: string) => {
    return expenses.filter((exp) => exp.tripId === tripId)
  }

  const calculateBalances = (tripId: string): Record<string, number> => {
    const trip = trips.find((t) => t.id === tripId)
    if (!trip) return {}

    const balances: Record<string, number> = {}
    trip.participants.forEach((p) => {
      balances[p.id] = 0
    })

    const tripExpenses = getExpensesByTrip(tripId)
    tripExpenses.forEach((expense) => {
      const paidByAmount = expense.splits.find((s) => s.participantId === expense.paidBy)?.amount || 0
      balances[expense.paidBy] += paidByAmount

      expense.splits.forEach((split) => {
        if (split.participantId !== expense.paidBy) {
          balances[split.participantId] -= split.amount
        }
      })
    })

    return balances
  }

  return (
    <TripContext.Provider
      value={{
        trips,
        expenses,
        addTrip,
        updateTrip,
        deleteTrip,
        addExpense,
        deleteExpense,
        getExpensesByTrip,
        calculateBalances,
      }}
    >
      {children}
    </TripContext.Provider>
  )
}

export function useTrips() {
  const context = useContext(TripContext)
  if (!context) {
    throw new Error("useTrips must be used within a TripProvider")
  }
  return context
}
