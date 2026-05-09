"use client"

import { AuditLog } from "@/types/admin"

// ─────────────────────────────────────────────────────────────
// Audit Logs Table
//
// Purpose:
// - Displays immutable system activity logs.
// - No edit/delete actions are provided because audit logs
//   should not be modified from the frontend.
//
// Endpoint used indirectly:
// GET /api/v1/admin/audit-logs
// ─────────────────────────────────────────────────────────────

interface Props {
  logs: AuditLog[]
}

export function AuditLogsTable({ logs }: Props) {
  if (logs.length === 0) {
    return (
      <div className="text-center py-12 text-gray-900">
        No audit logs found.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#f5f7f8] text-gray-600">
            <th className="text-left px-4 py-3 font-medium">Action</th>
            <th className="text-left px-4 py-3 font-medium">Performed By</th>
            <th className="text-left px-4 py-3 font-medium">Target</th>
            <th className="text-left px-4 py-3 font-medium">Details</th>
            <th className="text-left px-4 py-3 font-medium">Time</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((log) => (
            <tr
              key={log.id}
              className="border-b border-gray-100 text-gray-900"
            >
              <td className="px-4 py-3">
                <ActionBadge actionType={log.actionType} />
              </td>

              <td className="px-4 py-3 font-medium">
                {log.performedBy}
              </td>

              <td className="px-4 py-3 text-gray-600">
                {log.targetId}
              </td>

              <td className="px-4 py-3 text-gray-700">
                {log.details}
              </td>

              <td className="px-4 py-3 text-gray-600">
                {new Date(log.timestamp).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Small badge helper for action type readability.
function ActionBadge({ actionType }: { actionType: string }) {
  return (
    <span className="inline-flex px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
      {actionType}
    </span>
  )
}