import { useImaging } from '@/hooks/useDoctors'
import { ImagingReport } from '@/types/doctors'

interface Props {
  caseId: string
}

const statusColor: Record<string, string> = {
  AVAILABLE: 'text-green-700',
  PENDING:   'text-yellow-700',
}

export function ImagingTab({ caseId }: Props) {
  const { data, isLoading, isError } = useImaging(caseId)

  if (isLoading) return <p className="text-gray-700 text-sm">Loading imaging reports...</p>
  if (isError)   return <p className="text-red-600 text-sm">Failed to load imaging reports.</p>
  if (!data?.data.length) return <p className="text-gray-700 text-sm">No imaging reports available yet.</p>

  return (
    <div className="space-y-3">
      {data.data.map((img: ImagingReport) => (
        <div key={img.id} className="border border-gray-100 rounded-2xl p-4 bg-white">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-sm text-gray-900">
              {img.type} — {img.region}
            </span>
            <span className={`text-xs font-semibold ${statusColor[img.status]}`}>
              {img.status}
            </span>
          </div>
          <p className="text-sm text-gray-900">{img.report}</p>
          <p className="text-xs text-gray-700 mt-1">
            {new Date(img.date).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  )
}