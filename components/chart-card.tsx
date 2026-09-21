import type { ReactNode } from "react"

interface ChartCardProps {
  title: string
  children: ReactNode
  className?: string
}

export function ChartCard({ title, children, className = "" }: ChartCardProps) {
  return (
    <div className={`bg-card rounded-xl p-6 shadow-sm border border-border ${className}`}>
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      {children}
    </div>
  )
}
