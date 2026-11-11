import { Link } from 'react-router-dom'
import {
  ClipboardList,
  Database,
  Eye,
  Paperclip,
  Trash2,
} from 'lucide-react'
import Card from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'
import {
  formatDate,
  formatDuration,
  formatTime,
} from '../../lib/dates'
import TreatmentStatus from './TreatmentStatus'

export default function TreatmentTable({
  treatments,
  emptyAction,
  onDeleteRequest,
}) {
  const sortedTreatments = [...treatments].sort(
    (a, b) => new Date(b.startTime) - new Date(a.startTime),
  )

  if (!sortedTreatments.length) {
    return (
      <Card>
        <EmptyState
          icon={ClipboardList}
          title="No treatment records yet"
          description="Add the first treatment to start building a complete diagnostic history in this browser."
          action={emptyAction}
        />
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Treatment history
          </h2>
          <p className="text-xs text-slate-500">
            {sortedTreatments.length}{' '}
            {sortedTreatments.length === 1 ? 'record' : 'records'} · newest
            first
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-500 ring-1 ring-inset ring-slate-200">
          <Database className="h-3.5 w-3.5" />
          Saved in this browser
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] text-left text-sm">
          <thead className="bg-slate-50/80 text-[10px] uppercase tracking-[0.14em] text-slate-500">
            <tr>
              <th scope="col" className="px-5 py-3 font-semibold">
                Disease
              </th>
              <th scope="col" className="px-5 py-3 font-semibold">
                Doctor
              </th>
              <th scope="col" className="px-5 py-3 font-semibold">
                Start
              </th>
              <th scope="col" className="px-5 py-3 font-semibold">
                End
              </th>
              <th scope="col" className="px-5 py-3 font-semibold">
                Status
              </th>
              <th scope="col" className="px-5 py-3 font-semibold">
                Prescription
              </th>
              <th scope="col" className="px-5 py-3 font-semibold">
                Files
              </th>
              <th scope="col" className="px-5 py-3 text-right font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedTreatments.map((treatment) => (
              <tr
                key={treatment.id}
                className="align-top transition hover:bg-slate-50/70"
              >
                <td className="px-5 py-4">
                  <Link
                    to={`/treatments/${treatment.id}`}
                    className="font-semibold text-slate-900 hover:text-emerald-700"
                  >
                    {treatment.disease}
                  </Link>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    {treatment.diseaseCategory}
                  </p>
                </td>
                <td className="px-5 py-4">
                  <p className="font-medium text-slate-700">
                    {treatment.doctorName}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    {treatment.doctorSpecialization}
                  </p>
                </td>
                <td className="whitespace-nowrap px-5 py-4">
                  <p className="font-medium text-slate-700">
                    {formatDate(treatment.startTime)}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    {formatTime(treatment.startTime)}
                  </p>
                </td>
                <td className="whitespace-nowrap px-5 py-4">
                  <p className="font-medium text-slate-700">
                    {formatDate(treatment.endTime)}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    {formatTime(treatment.endTime)} ·{' '}
                    {formatDuration(treatment.startTime, treatment.endTime)}
                  </p>
                </td>
                <td className="whitespace-nowrap px-5 py-4">
                  <TreatmentStatus
                    startTime={treatment.startTime}
                    endTime={treatment.endTime}
                  />
                </td>
                <td className="px-5 py-4">
                  <p className="line-clamp-2 max-w-[260px] text-xs leading-5 text-slate-600">
                    {treatment.prescription}
                  </p>
                  {treatment.notes ? (
                    <p className="mt-1 line-clamp-1 max-w-[260px] text-[10px] text-slate-400">
                      {treatment.notes}
                    </p>
                  ) : null}
                </td>
                <td className="whitespace-nowrap px-5 py-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <Paperclip className="h-3.5 w-3.5" />
                    {treatment.documents?.length ?? 0}
                  </span>
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      to={`/treatments/${treatment.id}`}
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </Link>
                    {onDeleteRequest ? (
                      <button
                        type="button"
                        onClick={() => onDeleteRequest(treatment)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                        aria-label={`Delete ${treatment.disease} treatment`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
