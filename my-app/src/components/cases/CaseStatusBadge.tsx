import { CaseStatus } from '@/types/queue'

const config: Record<CaseStatus, { label: string; classes: string }> = {
  WAITING:         { label: 'Waiting',          classes: 'bg-yellow-100 text-yellow-800' },
  UNDER_TREATMENT: { label: 'Under Treatment',  classes: 'bg-blue-100 text-blue-800' },
  COMPLETED:       { label: 'Completed',         classes: 'bg-gray-100 text-gray-600' },
}

export function CaseStatusBadge({ status }: { status: CaseStatus }) {
  const { label, classes } = config[status]
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${classes}`}>
      {label}
    </span>
  )
}