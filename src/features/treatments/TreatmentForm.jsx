import { useState } from 'react'
import { AlertCircle, CalendarClock, Save, X } from 'lucide-react'
import Button from '../../components/ui/Button'
import { Field, Input, Select, Textarea } from '../../components/ui/Field'
import {
  DISEASE_CATALOG,
  DOCTORS,
  findDisease,
  findDoctor,
} from '../../data/catalog'
import { toDateTimeInput, toDateTimeLocalValue } from '../../lib/dates'
import DocumentUploader from './DocumentUploader'

function buildInitialValues(treatment) {
  if (treatment) {
    return {
      disease: treatment.disease ?? '',
      doctorId: treatment.doctorId ?? '',
      startTime: toDateTimeInput(treatment.startTime),
      endTime: toDateTimeInput(treatment.endTime),
      prescription: treatment.prescription ?? '',
      notes: treatment.notes ?? '',
      documents: treatment.documents ?? [],
    }
  }

  const start = new Date()
  const end = new Date(start.getTime() + 45 * 60 * 1000)

  return {
    disease: '',
    doctorId: '',
    startTime: toDateTimeLocalValue(start),
    endTime: toDateTimeLocalValue(end),
    prescription: '',
    notes: '',
    documents: [],
  }
}

function validate(values) {
  const errors = {}

  if (!values.disease) errors.disease = 'Select a disease from the list.'
  if (!values.doctorId) errors.doctorId = 'Select the treating doctor.'
  if (!values.startTime) errors.startTime = 'Add the treatment start time.'
  if (!values.endTime) errors.endTime = 'Add the treatment end time.'

  if (values.startTime && values.endTime) {
    const start = new Date(values.startTime)
    const end = new Date(values.endTime)

    if (end.getTime() <= start.getTime()) {
      errors.endTime = 'End time must be after the start time.'
    }
  }

  if (!values.prescription.trim()) {
    errors.prescription = 'Add the prescription or treatment instructions.'
  }

  return errors
}

export default function TreatmentForm({
  initialTreatment = null,
  onSubmit,
  onCancel,
  submitLabel = 'Save treatment',
}) {
  const [values, setValues] = useState(() =>
    buildInitialValues(initialTreatment),
  )
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  const isEditing = Boolean(initialTreatment)

  function updateField(field, value) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => {
      if (!current[field] && !current.form) return current
      const next = { ...current }
      delete next[field]
      delete next.form
      return next
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const nextErrors = validate(values)

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }

    const disease = findDisease(values.disease)
    const doctor = findDoctor(values.doctorId)

    if (!disease || !doctor) {
      setErrors({ form: 'The selected disease or doctor is no longer available.' })
      return
    }

    setBusy(true)
    setErrors({})

    const result = await onSubmit({
      disease: disease.name,
      diseaseCategory: disease.category,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialization: doctor.specialization,
      startTime: new Date(values.startTime).toISOString(),
      endTime: new Date(values.endTime).toISOString(),
      prescription: values.prescription.trim(),
      notes: values.notes.trim(),
      documents: values.documents,
    })

    setBusy(false)

    if (!result?.ok) {
      setErrors({ form: result?.error ?? 'The treatment could not be saved.' })
      return
    }

    if (!isEditing) {
      setValues(buildInitialValues())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {errors.form ? (
        <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{errors.form}</p>
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Disease / condition"
          htmlFor="treatment-disease"
          required
          error={errors.disease}
        >
          <Select
            id="treatment-disease"
            value={values.disease}
            onChange={(event) => updateField('disease', event.target.value)}
            aria-invalid={Boolean(errors.disease)}
          >
            <option value="">Select a disease</option>
            {DISEASE_CATALOG.map((group) => (
              <optgroup key={group.category} label={group.category}>
                {group.diseases.map((disease) => (
                  <option key={disease} value={disease}>
                    {disease}
                  </option>
                ))}
              </optgroup>
            ))}
          </Select>
        </Field>

        <Field
          label="Treating doctor"
          htmlFor="treatment-doctor"
          required
          error={errors.doctorId}
        >
          <Select
            id="treatment-doctor"
            value={values.doctorId}
            onChange={(event) => updateField('doctorId', event.target.value)}
            aria-invalid={Boolean(errors.doctorId)}
          >
            <option value="">Select a doctor</option>
            {DOCTORS.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name} · {doctor.specialization}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          label="Start time"
          htmlFor="treatment-start"
          required
          error={errors.startTime}
        >
          <Input
            id="treatment-start"
            type="datetime-local"
            value={values.startTime}
            onChange={(event) => updateField('startTime', event.target.value)}
            aria-invalid={Boolean(errors.startTime)}
          />
        </Field>

        <Field
          label="End time"
          htmlFor="treatment-end"
          required
          error={errors.endTime}
        >
          <Input
            id="treatment-end"
            type="datetime-local"
            value={values.endTime}
            onChange={(event) => updateField('endTime', event.target.value)}
            aria-invalid={Boolean(errors.endTime)}
          />
        </Field>
      </div>

      <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
        <CalendarClock className="h-4 w-4 text-slate-400" />
        Use the actual visit start and end times so the record sorts correctly.
      </div>

      <Field
        label="Prescription"
        htmlFor="treatment-prescription"
        hint={`${values.prescription.length} characters`}
        required
        error={errors.prescription}
      >
        <Textarea
          id="treatment-prescription"
          placeholder="Medicines, dosage, frequency and instructions…"
          value={values.prescription}
          onChange={(event) => updateField('prescription', event.target.value)}
          aria-invalid={Boolean(errors.prescription)}
        />
      </Field>

      <Field
        label="Additional notes"
        htmlFor="treatment-notes"
        hint="Optional"
      >
        <Textarea
          id="treatment-notes"
          rows={3}
          placeholder="Symptoms, test findings or follow-up instructions…"
          value={values.notes}
          onChange={(event) => updateField('notes', event.target.value)}
        />
      </Field>

      <div>
        <p className="mb-1.5 text-sm font-medium text-slate-700">
          Prescription documents
        </p>
        <DocumentUploader
          documents={values.documents}
          onChange={(documents) => updateField('documents', documents)}
        />
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-5">
        {onCancel ? (
          <Button variant="secondary" onClick={onCancel} disabled={busy}>
            <X className="h-4 w-4" />
            Cancel
          </Button>
        ) : null}
        <Button type="submit" disabled={busy}>
          <Save className="h-4 w-4" />
          {busy ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
