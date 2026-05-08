import { useLabResults } from '@/hooks/useDoctors'
import { LabResult } from '@/types/doctors'

interface Props {
  caseId: string
}

const statusColor: Record<string, string> = {
  AVAILABLE: 'text-green-600',
  PENDING:   'text-yellow-500',
}

export function LabResultsTab({ caseId }: Props) {
  const { data, isLoading, isError } = useLabResults(caseId)

  if (isLoading) return <p className="text-gray-400 text-sm">Loading lab results...</p>
  if (isError)   return <p className="text-red-500 text-sm">Failed to load lab results.</p>
  if (!data?.data.length) return <p className="text-gray-400 text-sm">No lab results available yet.</p>

  return (
    <div className="space-y-3">
      {data.data.map((lab: LabResult) => (
        <div key={lab.id} className="border rounded-lg p-4 bg-white">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-sm">{lab.type}</span>
            <span className={`text-xs font-semibold ${statusColor[lab.status]}`}>
              {lab.status}
            </span>
          </div>
          <p className="text-sm text-gray-700">{lab.result}</p>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(lab.date).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  )
}