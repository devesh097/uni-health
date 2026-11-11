import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import { PatientProvider } from './context/PatientProvider'
import NotFoundPage from './pages/NotFoundPage'
import OverviewPage from './pages/OverviewPage'
import TreatmentDetailPage from './pages/TreatmentDetailPage'
import TreatmentsPage from './pages/TreatmentsPage'

export default function App() {
  return (
    <PatientProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<OverviewPage />} />
            <Route path="treatments" element={<TreatmentsPage />} />
            <Route
              path="treatments/:treatmentId"
              element={<TreatmentDetailPage />}
            />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PatientProvider>
  )
}
