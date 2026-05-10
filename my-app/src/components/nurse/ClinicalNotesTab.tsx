"use client"

import { useState } from 'react'
import { useClinicalNotes, useAddNote } from '@/hooks/useNurse'
import { NoteRecord } from '@/types/nurse'

interface Props {
  caseId: string
  userRole: 'DOCTOR' | 'NURSE'
}

// Doctors and nurses see notes, only nurses can add one.

export function ClinicalNotesTab({ caseId, userRole }: Props) {
  const { data, isLoading, isError } = useClinicalNotes(caseId)

  return (
    <div className="space-y-6">
      {/* Nurse-only: add a new note */}
      {userRole === 'NURSE' && <AddNoteForm caseId={caseId} />}

      {/* Both roles: view notes */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Clinical Notes</h3>

        {isLoading && <p className="text-sm text-gray-700">Loading...</p>}
        {isError && <p className="text-sm text-red-600">Failed to load notes.</p>}

        {!isLoading && !isError && data?.data.length === 0 && (
          <p className="text-sm text-gray-700">No clinical notes yet.</p>
        )}

        <div className="space-y-3">
          {data?.data.map((note: NoteRecord) => (
            <div key={note.id} className="bg-white border border-gray-100 rounded-2xl p-4">
              <p className="text-sm text-gray-900">{note.note}</p>
              <p className="text-xs text-gray-700 mt-2">
                {new Date(note.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AddNoteForm({ caseId }: { caseId: string }) {
  const [note, setNote] = useState('')
  const { mutate, isPending, isError, isSuccess, reset } = useAddNote(caseId)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!note.trim()) return
    mutate(
      { note: note.trim() },
      { onSuccess: () => setNote('') }
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-100 rounded-2xl p-4 space-y-3"
    >
      <h3 className="text-sm font-semibold text-gray-900">Add Clinical Note</h3>

      <textarea
        value={note}
        onChange={(e) => { setNote(e.target.value); reset() }}
        placeholder="Enter clinical observation..."
        rows={3}
        className="w-full border rounded px-3 py-2 text-sm resize-none text-black"
        required
      />

      {isError && <p className="text-xs text-red-500">Failed to add note. Try again.</p>}
      {isSuccess && <p className="text-xs text-green-600">Note added successfully.</p>}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-gray-800 text-white py-2 rounded text-sm hover:bg-gray-900 disabled:opacity-50"
      >
        {isPending ? 'Saving...' : 'Add Note'}
      </button>
    </form>
  )
}