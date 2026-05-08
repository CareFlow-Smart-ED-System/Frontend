const config = {
  CRITICAL:   { label: 'Critical',   classes: 'bg-red-600 text-white' },
  URGENT:     { label: 'Urgent',     classes: 'bg-orange-400 text-white' },
  NON_URGENT: { label: 'Non-Urgent', classes: 'bg-green-500 text-white' },
}

export function TriageBadge({ severity }: { severity: string }) {
  const { label, classes } = config[severity] ?? { label: severity, classes: 'bg-gray-400 text-white' }
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${classes}`}>
      {label}
    </span>
  )
}