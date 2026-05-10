import { Severity } from '@/types/queue'

type BadgeConfig = {
  label: string
  classes: string
}

const config: Record<string, BadgeConfig> = {
  CRITICAL:   { label: 'Critical',   classes: 'bg-red-600 text-white' },
  URGENT:     { label: 'Urgent',     classes: 'bg-orange-400 text-white' },
  NON_URGENT: { label: 'Non-Urgent', classes: 'bg-green-500 text-white' },
}

const fallback: BadgeConfig = { label: 'Unknown', classes: 'bg-gray-200 text-gray-600' }

export function TriageBadge({ severity }: { severity: Severity | string | null | undefined }) {
  const { label, classes } = config[severity ?? ''] ?? fallback
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${classes}`}>
      {label}
    </span>
  )
}