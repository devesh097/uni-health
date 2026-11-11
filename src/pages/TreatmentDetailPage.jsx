import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  CalendarClock,
  Database,
  Download,
  FileImage,
  FileText,
  GraduationCap,
  Hospital,
  Pencil,
  Stethoscope,
  Timer,
  Trash2,
} from 'lucide-react'
import Badge from '../components/ui/Badge'
import Button, { buttonClasses } from '../components/ui/Button'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import Modal from '../components/ui/Modal'
import TreatmentForm from '../features/treatments/TreatmentForm'
import { usePatient } from '../hooks/usePatient'
import { findDoctor } from '../data/catalog'
import {
  formatBytes,
} from '../lib/storage'
import {
  formatDateTime,
  formatDuration,
  getTreatmentStatus,
} from '../lib/dates'

const DOT_TONES = {
  emerald: 'bg-emerald-400',
  amber: 'bg-amber-400',
  sky: 'bg-sky-400',
  slate: 'bg-slate-400',
}

function InfoTile({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-inset ring-slate-100">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="mt-1.5 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  )
}

export default function TreatmentDetailPage() {
  const { treatmentId } = useParams()
  const navigate = useNavigate()
  const { treatments, updateTreatment, deleteTreatment } = usePatient()
  const [editing, setEditing] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [previewDocument, setPreviewDocument] = useState(null)

  const treatment = treatments.find((item) => item.id === treatmentId)

  if (!treatment) {
    return (
      <Card className="mx-auto max-w-xl">
        <EmptyState
          icon={FileText}
          title="Treatment record not found"
          description="This record may have been deleted or belongs to another browser profile."
          action={
            <Link
              to="/treatments"
              className={buttonClasses({ variant: 'secondary', size: 'sm' })}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to records
            </Link>
          }
        />
      </Card>
    )
  }

  const status = getTreatmentStatus(treatment.startTime, treatment.endTime)
  const doctor = findDoctor(treatment.doctorId)
  const documents = treatment.documents ?? []
  const degree = doctor?.degree ?? 'Qualification not recorded'
  const experience = doctor?.experience
  const hospital = doctor?.hospital ?? 'Clinic not recorded'

  function handleUpdate(values) {
    const result = updateTreatment(treatment.id, values)

    if (result.ok) setEditing(false)
    return result
  }

  function handleDelete() {
    const result = deleteTreatment(treatment.id)

    if (result.ok) {
      navigate('/treatments', { replace: true })
    }
  }

  return (
    <div className="space-y-6">
      <Link
        to="/treatments"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-emerald-700"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to treatment records
      </Link>

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-6 py-7 text-white shadow-xl shadow-slate-900/10 sm:px-8">
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-emerald-500/20 blur-3xl" />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-200 ring-1 ring-inset ring-white/10">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${DOT_TONES[status.tone] ?? DOT_TONES.slate}`}
                />
                {status.label}
              </span>
              <span className="text-[11px] text-slate-400">
                {treatment.diseaseCategory}
              </span>
            </div>

            <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              {treatment.disease}
            </h1>
            <p className="mt-1.5 text-sm text-slate-300">
              Treated by {treatment.doctorName} ·{' '}
              {treatment.doctorSpecialization}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setEditing(true)}
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit record
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setConfirmingDelete(true)}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-base font-bold text-slate-900">
              Visit timeline
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <InfoTile
                icon={CalendarClock}
                label="Started"
                value={formatDateTime(treatment.startTime)}
              />
              <InfoTile
                icon={CalendarClock}
                label="Ended"
                value={formatDateTime(treatment.endTime)}
              />
              <InfoTile
                icon={Timer}
                label="Duration"
                value={formatDuration(treatment.startTime, treatment.endTime)}
              />
              <InfoTile
                icon={Database}
                label="Logged"
                value={formatDateTime(treatment.createdAt)}
              />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">
                Prescription
              </h2>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700">
              {treatment.prescription || 'No prescription recorded.'}
            </p>

            {treatment.notes ? (
              <>
                <div className="my-5 h-px bg-slate-100" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Additional notes
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                  {treatment.notes}
                </p>
              </>
            ) : null}
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <FileImage className="h-4 w-4 text-emerald-600" />
                <h2 className="text-base font-bold text-slate-900">
                  Attached documents
                </h2>
              </div>
              <Badge tone="slate">{documents.length}</Badge>
            </div>

            {documents.length ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {documents.map((document) => (
                  <button
                    key={document.id}
                    type="button"
                    onClick={() => setPreviewDocument(document)}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left transition hover:border-emerald-300 hover:shadow-md"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                      <img
                        src={document.dataUrl}
                        alt={document.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-3 p-3">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-slate-700">
                          {document.name}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {formatBytes(document.size)}
                        </p>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700">
                        Preview
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60">
                <EmptyState
                  icon={FileImage}
                  title="No documents attached"
                  description="Edit this record to add a prescription photo or scan."
                  className="py-10"
                />
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-100">
              <Stethoscope className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-base font-bold text-slate-900">
              {treatment.doctorName}
            </h2>
            <p className="text-sm text-slate-500">
              {treatment.doctorSpecialization}
            </p>

            <div className="mt-5 space-y-4">
              <div className="flex items-start gap-3">
                <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    Degree
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-slate-700">
                    {degree}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Timer className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    Experience
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-slate-700">
                    {experience ? `${experience} years` : 'Not recorded'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Hospital className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    Practice
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-slate-700">
                    {hospital}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-base font-bold text-slate-900">
              Record metadata
            </h2>
            <dl className="mt-4 space-y-3 text-xs">
              <div className="flex items-start justify-between gap-4">
                <dt className="text-slate-400">Record ID</dt>
                <dd className="max-w-[190px] break-all text-right font-mono text-[10px] text-slate-600">
                  {treatment.id}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-slate-400">Last updated</dt>
                <dd className="text-right font-medium text-slate-600">
                  {formatDateTime(treatment.updatedAt)}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-slate-400">Storage</dt>
                <dd className="text-right font-medium text-slate-600">
                  This browser
                </dd>
              </div>
            </dl>
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-[10px] leading-4 text-slate-500 ring-1 ring-inset ring-slate-100">
              <Database className="h-3.5 w-3.5 shrink-0" />
              Available to search and sorting modules through localStorage.
            </div>
          </Card>
        </div>
      </div>

      <Modal
        open={editing}
        onClose={() => setEditing(false)}
        title="Edit treatment record"
        description="Update the visit details and save the changes locally."
        size="lg"
      >
        <TreatmentForm
          initialTreatment={treatment}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(false)}
          submitLabel="Update treatment"
        />
      </Modal>

      <Modal
        open={confirmingDelete}
        onClose={() => setConfirmingDelete(false)}
        title="Delete this treatment?"
        description="The record and its attached documents will be removed permanently."
        size="sm"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setConfirmingDelete(false)}
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
          Delete the{' '}
          <span className="font-semibold text-slate-900">
            {treatment.disease}
          </span>{' '}
          record dated {formatDateTime(treatment.startTime)}?
        </p>
      </Modal>

      <Modal
        open={Boolean(previewDocument)}
        onClose={() => setPreviewDocument(null)}
        title={previewDocument?.name ?? 'Document preview'}
        description={`Uploaded ${formatDateTime(previewDocument?.uploadedAt)}`}
        size="lg"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setPreviewDocument(null)}
            >
              Close
            </Button>
            {previewDocument ? (
              <a
                href={previewDocument.dataUrl}
                download={previewDocument.name}
                className={buttonClasses({ size: 'md' })}
              >
                <Download className="h-4 w-4" />
                Download
              </a>
            ) : null}
          </>
        }
      >
        {previewDocument ? (
          <img
            src={previewDocument.dataUrl}
            alt={previewDocument.name}
            className="max-h-[60vh] w-full rounded-2xl bg-slate-100 object-contain"
          />
        ) : null}
      </Modal>
    </div>
  )
}
