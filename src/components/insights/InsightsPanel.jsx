import { useMemo } from 'react'
import { formatCurrency } from '../../utils/helpers'

export default function InsightsPanel({ transactions }) {
  const insights = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === 'expense')

    const byCategory = {}
    expenses.forEach((t) => {
      byCategory[t.category] = (byCategory[t.category] || 0) + t.amount
    })
    const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]

    const now = new Date()
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonth = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}`

    let thisMonthSpend = 0
    let lastMonthSpend = 0
    expenses.forEach((t) => {
      const m = t.date.slice(0, 7)
      if (m === thisMonth) thisMonthSpend += t.amount
      if (m === lastMonth) lastMonthSpend += t.amount
    })

    const pctChange = lastMonthSpend > 0
      ? ((thisMonthSpend - lastMonthSpend) / lastMonthSpend) * 100
      : 0

    const totalIncome = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const totalExpense = expenses.reduce((s, t) => s + t.amount, 0)
    const ratio = totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0

    return { topCategory, thisMonthSpend, lastMonthSpend, pctChange, ratio }
  }, [transactions])

  const cards = [
    {
      title: 'Highest Spending Category',
      value: insights.topCategory ? insights.topCategory[0] : '—',
      sub: insights.topCategory ? formatCurrency(insights.topCategory[1]) : '',
      color: 'text-red-500',
    },
    {
      title: 'This Month vs Last Month',
      value: `${insights.pctChange >= 0 ? '+' : ''}${insights.pctChange.toFixed(1)}%`,
      sub: `${formatCurrency(insights.thisMonthSpend)} vs ${formatCurrency(insights.lastMonthSpend)}`,
      color: insights.pctChange > 0 ? 'text-red-500' : 'text-emerald-600',
    },
    {
      title: 'Expense-to-Income Ratio',
      value: `${insights.ratio.toFixed(1)}%`,
      sub: insights.ratio < 80 ? 'Healthy spending' : 'Consider cutting back',
      color: insights.ratio < 80 ? 'text-emerald-600' : 'text-amber-500',
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800"
        >
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.title}</p>
          <p className={`mt-2 text-2xl font-semibold ${card.color}`}>{card.value}</p>
          {card.sub && (
            <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">{card.sub}</p>
          )}
        </div>
      ))}
    </div>
  )
}
