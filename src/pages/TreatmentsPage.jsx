import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  CheckCircle2,
  ClipboardList,
  Plus,
  X,
} from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Modal from '../components/ui/Modal'
import TreatmentForm from '../features/treatments/TreatmentForm'
import TreatmentTable from '../features/treatments/TreatmentTable'
import { usePatient } from '../hooks/usePatient'

export default function TreatmentsPage() {
  const { treatments, addTreatment, deleteTreatment } = usePatient()
  const [searchParams, setSearchParams] = useSearchParams()
  const [notice, setNotice] = useState('')
  const [pendingDelete, setPendingDelete] = useState(null)

  const showForm = searchParams.get('new') === '1'

  function openForm() {
    setNotice('')
    setSearchParams({ new: '1' })
  }

  function closeForm() {
    const next = new URLSearchParams(searchParams)
    next.delete('new')
    setSearchParams(next, { replace: true })
  }

  function handleAdd(values) {
    const result = addTreatment(values)

    if (result.ok) {
      setNotice(`${values.disease} treatment was saved to this browser.`)
      closeForm()
    }

    return result
  }

  function handleDelete() {
    if (!pendingDelete) return

    const result = deleteTreatment(pendingDelete.id)

    if (result.ok) {
      setNotice(`${pendingDelete.disease} treatment was deleted.`)
      setPendingDelete(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-600">
            Patient module
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Treatment records
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Register visits, prescriptions and prescription photos. Every
            change is persisted automatically in this browser.
          </p>
        </div>

        <Button
          variant={showForm ? 'secondary' : 'primary'}
          onClick={showForm ? closeForm : openForm}
        >
          {showForm ? (
            <>
              <X className="h-4 w-4" />
              Close form
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Add treatment
            </>
          )}
        </Button>
      </div>

      {notice ? (
        <div
          role="status"
          className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <p className="flex-1">{notice}</p>
          <button
            type="button"
            onClick={() => setNotice('')}
            className="rounded-lg p-1 text-emerald-600 transition hover:bg-emerald-100"
            aria-label="Dismiss message"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : null}

      {showForm ? (
        <Card className="overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50/60 px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm ring-1 ring-inset ring-slate-200">
                <ClipboardList className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  New treatment record
                </h2>
                <p className="text-xs text-slate-500">
                  Disease, doctor, visit time, prescription and documents
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <TreatmentForm
              onSubmit={handleAdd}
              onCancel={closeForm}
              submitLabel="Save treatment"
            />
          </div>
        </Card>
      ) : null}

      <TreatmentTable
        treatments={treatments}
        onDeleteRequest={setPendingDelete}
        emptyAction={
          <Button size="sm" onClick={openForm}>
            <Plus className="h-3.5 w-3.5" />
            Add your first treatment
          </Button>
        }
      />

      <Modal
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        title="Delete treatment record?"
        description="This action updates local browser storage immediately."
        size="sm"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setPendingDelete(null)}
            >
              Keep record
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete record
            </Button>
          </>
        }
      >
        <p className="text-sm leading-6 text-slate-600">
          The{' '}
          <span className="font-semibold text-slate-900">
            {pendingDelete?.disease}
          </span>{' '}
          treatment from{' '}
          <span className="font-semibold text-slate-900">
            {pendingDelete?.doctorName}
          </span>{' '}
          and its attached documents will be permanently removed from this
          browser.
        </p>
      </Modal>
    </div>
  )
}
