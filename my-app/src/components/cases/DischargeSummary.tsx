import { DischargeSummary as DischargeSummaryType } from '@/types/cases'

interface Props {
  summary: DischargeSummaryType
}

export function DischargeSummaryCard({ summary }: Props) {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-5 space-y-4">
      <h3 className="text-lg font-semibold text-green-800">Discharge Summary</h3>

      <div>
        <p className="text-sm font-bold text-gray-500 uppercase mb-1">Final Diagnosis</p>
        <p className="text-sm font-medium text-black/70">{summary.finalDiagnosis}</p>
      </div>

      <div>
        <p className="text-sm font-bold text-gray-500 uppercase mb-1">Treatment Summary</p>
        <p className="text-sm font-medium text-black/70">{summary.treatmentSummary}</p>
      </div>

      <div>
        <p className="text-sm font-bold text-gray-500 uppercase mb-2">Medications</p>
        <ul className="space-y-1">
          {summary.medications.map((med, i) => (
            <li key={i} className="text-sm text-black/70">
              <span className="font-medium text-black/70">{med.name}</span> — {med.dosage}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-sm font-bold text-gray-500 uppercase mb-1">Follow-up Recommendation</p>
        <p className="text-sm font-medium text-black/70">{summary.dischargeRecommendation}</p>
      </div>

      <p className="text-sm text-black/70">
        Discharged at {new Date(summary.dischargedAt).toLocaleString()}
      </p>
    </div>
  )
}