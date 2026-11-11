import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { DEFAULT_PATIENT } from '../data/patient'
import { SAMPLE_TREATMENTS } from '../data/sampleTreatments'
import { createId } from '../lib/ids'
import {
  STORAGE_KEYS,
  estimateStorageBytes,
  readJSON,
  writeJSON,
} from '../lib/storage'
import { PatientContext } from './PatientContext'

const STORAGE_ERROR_MESSAGE =
  'Could not save to this browser. Local storage may be full — remove a few document images and try again.'

function loadTreatments() {
  const stored = readJSON(STORAGE_KEYS.treatments, null)
  return Array.isArray(stored) ? stored : SAMPLE_TREATMENTS
}

export function PatientProvider({ children }) {
  const [patient, setPatient] = useState(() =>
    readJSON(STORAGE_KEYS.patient, DEFAULT_PATIENT),
  )
  const [treatments, setTreatments] = useState(loadTreatments)
  const [storageError, setStorageError] = useState('')

  const patientRef = useRef(patient)
  const treatmentsRef = useRef(treatments)

  useEffect(() => {
    if (readJSON(STORAGE_KEYS.patient, null) === null) {
      try {
        writeJSON(STORAGE_KEYS.patient, patientRef.current)
      } catch {
        setStorageError(STORAGE_ERROR_MESSAGE)
      }
    }

    if (readJSON(STORAGE_KEYS.treatments, null) === null) {
      try {
        writeJSON(STORAGE_KEYS.treatments, treatmentsRef.current)
      } catch {
        setStorageError(STORAGE_ERROR_MESSAGE)
      }
    }
  }, [])

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === STORAGE_KEYS.treatments) {
        const next = readJSON(STORAGE_KEYS.treatments, [])
        if (Array.isArray(next)) {
          treatmentsRef.current = next
          setTreatments(next)
        }
      }

      if (event.key === STORAGE_KEYS.patient) {
        const next = readJSON(STORAGE_KEYS.patient, DEFAULT_PATIENT)
        patientRef.current = next
        setPatient(next)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const storageUsage = useMemo(
    () => estimateStorageBytes({ patient, treatments }),
    [patient, treatments],
  )

  const persistTreatments = useCallback((next) => {
    try {
      writeJSON(STORAGE_KEYS.treatments, next)
    } catch {
      setStorageError(STORAGE_ERROR_MESSAGE)
      return { ok: false, error: STORAGE_ERROR_MESSAGE }
    }

    treatmentsRef.current = next
    setTreatments(next)
    setStorageError('')
    return { ok: true }
  }, [])

  const persistPatient = useCallback((next) => {
    try {
      writeJSON(STORAGE_KEYS.patient, next)
    } catch {
      setStorageError(STORAGE_ERROR_MESSAGE)
      return { ok: false, error: STORAGE_ERROR_MESSAGE }
    }

    patientRef.current = next
    setPatient(next)
    setStorageError('')
    return { ok: true }
  }, [])

  const addTreatment = useCallback(
    (input) => {
      const timestamp = new Date().toISOString()
      const treatment = {
        ...input,
        id: createId('trt'),
        createdAt: timestamp,
        updatedAt: timestamp,
      }

      const result = persistTreatments([treatment, ...treatmentsRef.current])
      return result.ok ? { ok: true, treatment } : result
    },
    [persistTreatments],
  )

  const updateTreatment = useCallback(
    (treatmentId, patch) => {
      const existing = treatmentsRef.current.find(
        (treatment) => treatment.id === treatmentId,
      )

      if (!existing) {
        return { ok: false, error: 'That treatment record could not be found.' }
      }

      const updated = {
        ...existing,
        ...patch,
        id: existing.id,
        createdAt: existing.createdAt,
        updatedAt: new Date().toISOString(),
      }

      const next = treatmentsRef.current.map((treatment) =>
        treatment.id === treatmentId ? updated : treatment,
      )
      const result = persistTreatments(next)
      return result.ok ? { ok: true, treatment: updated } : result
    },
    [persistTreatments],
  )

  const deleteTreatment = useCallback(
    (treatmentId) => {
      const next = treatmentsRef.current.filter(
        (treatment) => treatment.id !== treatmentId,
      )
      return persistTreatments(next)
    },
    [persistTreatments],
  )

  const updatePatient = useCallback(
    (patch) => {
      const next = {
        ...patientRef.current,
        ...patch,
        id: patientRef.current.id,
      }
      return persistPatient(next)
    },
    [persistPatient],
  )

  const value = useMemo(
    () => ({
      patient,
      treatments,
      storageUsage,
      storageError,
      addTreatment,
      updateTreatment,
      deleteTreatment,
      updatePatient,
      clearStorageError: () => setStorageError(''),
    }),
    [
      patient,
      treatments,
      storageUsage,
      storageError,
      addTreatment,
      updateTreatment,
      deleteTreatment,
      updatePatient,
    ],
  )

  return (
    <PatientContext.Provider value={value}>{children}</PatientContext.Provider>
  )
}
