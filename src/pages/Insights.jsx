import { useAppContext } from '../context/useAppContext'
import InsightsPanel from '../components/insights/InsightsPanel'

export default function Insights() {
  const { transactions } = useAppContext()

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Insights</h2>
      <InsightsPanel transactions={transactions} />
    </div>
  )
}
