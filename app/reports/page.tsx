"use client"

import { useMemo, useState } from "react"
import { Navbar } from "@/components/navbar"
import { ChartCard } from "@/components/chart-card"
import { useTrips } from "@/contexts/trip-context"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPie,
  Cell,
} from "recharts"

const COLORS = ["#3B82F6", "#F59E0B", "#10B981", "#8B5CF6", "#EC4899", "#06B6D4"]

export default function ReportsPage() {
  const { trips, getExpensesByTrip } = useTrips()
  const [selectedTripId, setSelectedTripId] = useState<string>(trips[0]?.id || "1")

  const tripExpenses = useMemo(() => {
    return getExpensesByTrip(selectedTripId)
  }, [selectedTripId, getExpensesByTrip])

  const categoryData = useMemo(() => {
    const grouped = tripExpenses.reduce(
      (acc, exp) => {
        const existing = acc.find((item) => item.name === exp.category)
        if (existing) {
          existing.value += exp.amount
        } else {
          acc.push({ name: exp.category, value: exp.amount })
        }
        return acc
      },
      [] as Array<{ name: string; value: number }>,
    )
    return grouped
  }, [tripExpenses])

  const dailyData = useMemo(() => {
    const grouped = tripExpenses.reduce(
      (acc, exp) => {
        const date = new Date(exp.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
        const existing = acc.find((item) => item.date === date)
        if (existing) {
          existing.amount += exp.amount
        } else {
          acc.push({ date, amount: exp.amount })
        }
        return acc
      },
      [] as Array<{ date: string; amount: number }>,
    )
    return grouped.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [tripExpenses])

  const totalByCategory = useMemo(() => {
    return categoryData.reduce((sum, cat) => sum + cat.value, 0)
  }, [categoryData])

  const categoryBreakdown = useMemo(() => {
    return categoryData.map((cat) => ({
      ...cat,
      percentage: ((cat.value / totalByCategory) * 100).toFixed(1),
    }))
  }, [categoryData, totalByCategory])

  const selectedTrip = trips.find((t) => t.id === selectedTripId)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">Reports</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Analyze your spending patterns and trends</p>
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

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="bg-card rounded-xl p-4 sm:p-6 shadow-sm border border-border">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 sm:mb-2">Total Expenses</p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">
                ${tripExpenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
              </p>
            </div>
            <div className="bg-card rounded-xl p-4 sm:p-6 shadow-sm border border-border">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 sm:mb-2">Average Expense</p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">
                $
                {tripExpenses.length > 0
                  ? (tripExpenses.reduce((sum, exp) => sum + exp.amount, 0) / tripExpenses.length).toFixed(2)
                  : "0.00"}
              </p>
            </div>
            <div className="bg-card rounded-xl p-4 sm:p-6 shadow-sm border border-border">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 sm:mb-2">Budget Remaining</p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">
                ${selectedTrip ? (selectedTrip.budget - selectedTrip.spent).toFixed(2) : "0.00"}
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div className="lg:col-span-2">
              <ChartCard title="Spending by Category">
                {categoryData.length > 0 ? (
                  <div className="w-full h-64 sm:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={categoryData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis
                          dataKey="name"
                          stroke="var(--muted-foreground)"
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis stroke="var(--muted-foreground)" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: "8px",
                          }}
                        />
                        <Bar dataKey="value" fill="var(--primary)" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No category data available</p>
                )}
              </ChartCard>
            </div>

            <ChartCard title="Category Distribution">
              <div className="space-y-2 sm:space-y-3 max-h-80 overflow-y-auto">
                {categoryBreakdown.map((cat, index) => (
                  <div key={cat.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-xs sm:text-sm text-foreground font-medium truncate">{cat.name}</span>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="text-xs sm:text-sm font-semibold text-foreground">${cat.value.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">{cat.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>

          {/* Category Distribution Pie Chart */}
          <div className="mb-4 sm:mb-6">
            <ChartCard title="Category Distribution Pie">
              {categoryData.length > 0 ? (
                <div className="w-full h-64 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${((value / totalByCategory) * 100).toFixed(0)}%`}
                      outerRadius={60}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No category data available</p>
              )}
            </ChartCard>
          </div>

          <ChartCard title="Daily Spending Trend">
            {dailyData.length > 0 ? (
              <div className="w-full h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="date" stroke="var(--muted-foreground)" />
                    <YAxis stroke="var(--muted-foreground)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="var(--primary)"
                      strokeWidth={2}
                      dot={{ fill: "var(--primary)", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No spending data available</p>
            )}
          </ChartCard>
        </div>
      </main>
    </div>
  )
}
