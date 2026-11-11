import { useEffect, useState } from 'react'
import { AlertCircle, Save } from 'lucide-react'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { Field, Input, Select } from '../../components/ui/Field'
import { BLOOD_GROUPS } from '../../data/catalog'
import { usePatient } from '../../hooks/usePatient'

function buildValues(patient) {
  return {
    fullName: patient.fullName ?? '',
    dateOfBirth: patient.dateOfBirth ?? '',
    bloodGroup: patient.bloodGroup ?? '',
    phone: patient.phone ?? '',
    emergencyContact: patient.emergencyContact ?? '',
    allergies: patient.allergies ?? '',
    conditions: patient.conditions ?? '',
  }
}

export default function ProfileEditModal({ open, onClose }) {
  const { patient, updatePatient } = usePatient()
  const [values, setValues] = useState(() => buildValues(patient))
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!open) return
    setValues(buildValues(patient))
    setError('')
  }, [open, patient])

  function updateField(field, value) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!values.fullName.trim()) {
      setError('The patient name is required.')
      return
    }

    setBusy(true)
    const result = updatePatient({
      ...values,
      fullName: values.fullName.trim(),
      allergies: values.allergies.trim(),
      conditions: values.conditions.trim(),
    })
    setBusy(false)

    if (!result.ok) {
      setError(result.error)
      return
    }

    setError('')
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit patient profile"
      description="These details stay in this browser and are available to every module."
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {error ? (
          <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{error}</p>
          </div>
        ) : null}

        <Field label="Full name" htmlFor="profile-name" required>
          <Input
            id="profile-name"
            value={values.fullName}
            onChange={(event) => updateField('fullName', event.target.value)}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Date of birth" htmlFor="profile-dob">
            <Input
              id="profile-dob"
              type="date"
              value={values.dateOfBirth}
              onChange={(event) => updateField('dateOfBirth', event.target.value)}
            />
          </Field>

          <Field label="Blood group" htmlFor="profile-blood">
            <Select
              id="profile-blood"
              value={values.bloodGroup}
              onChange={(event) => updateField('bloodGroup', event.target.value)}
            >
              <option value="">Not known</option>
              {BLOOD_GROUPS.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Phone" htmlFor="profile-phone">
            <Input
              id="profile-phone"
              value={values.phone}
              onChange={(event) => updateField('phone', event.target.value)}
            />
          </Field>

          <Field label="Emergency contact" htmlFor="profile-emergency">
            <Input
              id="profile-emergency"
              value={values.emergencyContact}
              onChange={(event) =>
                updateField('emergencyContact', event.target.value)
              }
            />
          </Field>
        </div>

        <Field label="Known allergies" htmlFor="profile-allergies">
          <Input
            id="profile-allergies"
            placeholder="e.g. Penicillin, peanuts"
            value={values.allergies}
            onChange={(event) => updateField('allergies', event.target.value)}
          />
        </Field>

        <Field label="Ongoing conditions" htmlFor="profile-conditions">
          <Input
            id="profile-conditions"
            placeholder="e.g. Seasonal asthma"
            value={values.conditions}
            onChange={(event) => updateField('conditions', event.target.value)}
          />
        </Field>

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
          <Button variant="secondary" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button type="submit" disabled={busy}>
            <Save className="h-4 w-4" />
            {busy ? 'Saving…' : 'Save profile'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
