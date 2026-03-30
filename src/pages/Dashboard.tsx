import { DashboardSummary } from '@/components/dashboard/DashboardSummary'
import { TransactionTable } from '@/components/dashboard/TransactionTable'

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <DashboardSummary />
      <TransactionTable />
    </div>
  )
}
