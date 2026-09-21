"use client"

import { useState, useMemo } from "react"
import { Navbar } from "@/components/navbar"
import { StatCard } from "@/components/stat-card"
import { ChartCard } from "@/components/chart-card"
import { DollarSign, TrendingUp, Wallet, PieChart } from "lucide-react"
import {
  PieChart as RechartsPie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

// Mock data
const mockExpenses = [
  { id: "1", title: "Hotel", amount: 150, category: "Accommodation", date: "2024-10-15" },
  { id: "2", title: "Flight", amount: 450, category: "Transport", date: "2024-10-14" },
  { id: "3", title: "Dinner", amount: 45, category: "Food", date: "2024-10-16" },
  { id: "4", title: "Museum", amount: 25, category: "Activities", date: "2024-10-16" },
  { id: "5", title: "Taxi", amount: 30, category: "Transport", date: "2024-10-17" },
  { id: "6", title: "Lunch", amount: 35, category: "Food", date: "2024-10-17" },
]

const COLORS = ["#3B82F6", "#F59E0B", "#10B981", "#8B5CF6", "#EC4899", "#06B6D4"]

export default function Dashboard() {
  const [expenses] = useState(mockExpenses)

  const stats = useMemo(() => {
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0)
    const budget = 1000
    const remaining = budget - total

    return {
      totalBudget: budget,
      totalSpent: total,
      remaining: remaining,
      percentageUsed: ((total / budget) * 100).toFixed(1),
    }
  }, [expenses])

  const categoryData = useMemo(() => {
    const grouped = expenses.reduce(
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
  }, [expenses])

  const dailyData = useMemo(() => {
    const grouped = expenses.reduce(
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
  }, [expenses])

  const categoryBreakdown = useMemo(() => {
    const total = categoryData.reduce((sum, cat) => sum + cat.value, 0)
    return categoryData.map((cat) => ({
      ...cat,
      percentage: ((cat.value / total) * 100).toFixed(1),
    }))
  }, [categoryData])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">Welcome back!</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Here's your expense overview for this trip</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <StatCard title="Total Budget" value={`$${stats.totalBudget}`} icon={<Wallet className="w-6 h-6" />} />
            <StatCard
              title="Total Spent"
              value={`$${stats.totalSpent.toFixed(2)}`}
              icon={<DollarSign className="w-6 h-6" />}
              trend={{ value: 12, isPositive: false }}
            />
            <StatCard
              title="Remaining"
              value={`$${stats.remaining.toFixed(2)}`}
              icon={<TrendingUp className="w-6 h-6" />}
              trend={{ value: 8, isPositive: true }}
            />
            <StatCard title="Budget Used" value={`${stats.percentageUsed}%`} icon={<PieChart className="w-6 h-6" />} />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-2">
              <ChartCard title="Expenses by Category">
                {categoryData.length > 0 ? (
                  <div className="w-full h-64 sm:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: $${value}`}
                        outerRadius={60}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </RechartsPie>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No expense data available</p>
                )}
              </ChartCard>
            </div>

            <ChartCard title="Category Breakdown">
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

          {/* Daily Spending Trend */}
          <div className="mt-4 sm:mt-6">
            <ChartCard title="Daily Spending Trend">
              {dailyData.length > 0 ? (
                <div className="w-full h-64 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyData}>
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
                      <Bar dataKey="amount" fill="var(--primary)" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No spending data available</p>
              )}
            </ChartCard>
          </div>
        </div>
      </main>
    </div>
  )
}
