import { TimelineEntry, TimelineEntryType } from '@/types/cases'

const typeConfig: Record<TimelineEntryType, { label: string; color: string }> = {
  TRIAGE:        { label: 'Triage',       color: 'bg-red-500' },
  VITAL_SIGNS:   { label: 'Vital Signs',  color: 'bg-blue-500' },
  MEDICATION:    { label: 'Medication',   color: 'bg-purple-500' },
  NOTE:          { label: 'Note',         color: 'bg-gray-400' },
  STATUS_UPDATE: { label: 'Status',       color: 'bg-green-500' },
}

interface Props {
  entries: TimelineEntry[]
}

export function CaseTimeline({ entries }: Props) {
  if (entries.length === 0) {
    return <p className="text-gray-700 text-sm">No timeline events yet</p>
  }

  return (
    <ol className="relative border-l border-gray-200 ml-3">
      {entries.map((entry, i) => {
        const { label, color } = typeConfig[entry.type]
        return (
          <li key={i} className="mb-6 ml-6">
            <span className={`absolute -left-2 flex h-4 w-4 items-center justify-center rounded-full ${color}`} />
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-gray-700 uppercase">{label}</span>
              <span className="text-xs text-gray-700">
                {new Date(entry.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <p className="text-sm text-gray-900">{entry.details}</p>
            <p className="text-xs text-gray-700">by {entry.performedBy}</p>
          </li>
        )
      })}
    </ol>
  )
}