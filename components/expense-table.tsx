"use client"

import { Trash2, Edit2 } from "lucide-react"

interface Expense {
  id: string
  title: string
  amount: number
  category: string
  date: string
}

interface ExpenseTableProps {
  expenses: Expense[]
  onDelete: (id: string) => void
}

const categoryColors: Record<string, string> = {
  Food: "bg-orange-100 text-orange-800",
  Transport: "bg-blue-100 text-blue-800",
  Accommodation: "bg-purple-100 text-purple-800",
  Activities: "bg-green-100 text-green-800",
  Shopping: "bg-pink-100 text-pink-800",
  Other: "bg-gray-100 text-gray-800",
}

export function ExpenseTable({ expenses, onDelete }: ExpenseTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-semibold text-foreground">Title</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Category</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Date</th>
            <th className="text-right py-3 px-4 font-semibold text-foreground">Amount</th>
            <th className="text-center py-3 px-4 font-semibold text-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id} className="border-b border-border hover:bg-muted/50 transition-all duration-300">
              <td className="py-3 px-4 text-foreground">{expense.title}</td>
              <td className="py-3 px-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[expense.category] || categoryColors.Other}`}
                >
                  {expense.category}
                </span>
              </td>
              <td className="py-3 px-4 text-foreground">{new Date(expense.date).toLocaleDateString()}</td>
              <td className="py-3 px-4 text-right font-semibold text-foreground">${expense.amount.toFixed(2)}</td>
              <td className="py-3 px-4 text-center">
                <div className="flex justify-center gap-2">
                  <button className="p-2 hover:bg-muted rounded-lg transition-all duration-300 text-muted-foreground hover:text-foreground">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(expense.id)}
                    className="p-2 hover:bg-red-100 rounded-lg transition-all duration-300 text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
