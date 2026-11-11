import { useContext } from 'react'
import { PatientContext } from '../context/PatientContext'

export function usePatient() {
  const context = useContext(PatientContext)

  if (!context) {
    throw new Error('usePatient must be used inside a PatientProvider.')
  }

  return context
}
