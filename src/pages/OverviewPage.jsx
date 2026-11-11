import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Activity,
  ArrowRight,
  CalendarClock,
  ChevronRight,
  ClipboardList,
  Droplets,
  Pencil,
  Phone,
  Plus,
  Stethoscope,
  UserRound,
} from 'lucide-react'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import { buttonClasses } from '../components/ui/Button'
import ProfileEditModal from '../features/patient/ProfileEditModal'
import TreatmentStatus from '../features/treatments/TreatmentStatus'
import { usePatient } from '../hooks/usePatient'
import {
  formatDate,
  formatDateOnly,
  formatDateTime,
  getTreatmentStatus,
} from '../lib/dates'
import { getInitials } from '../lib/people'

const STAT_TONES = {
  emerald: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
  sky: 'bg-sky-50 text-sky-600 ring-sky-100',
  amber: 'bg-amber-50 text-amber-600 ring-amber-100',
  violet: 'bg-violet-50 text-violet-600 ring-violet-100',
}

function StatCard({ icon: Icon, label, value, detail, tone = 'emerald' }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
          <p className="mt-1 truncate text-xs text-slate-500">{detail}</p>
        </div>
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ${STAT_TONES[tone]}`}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </Card>
  )
}

function ProfileRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400 ring-1 ring-inset ring-slate-100">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          {label}
        </p>
        <p className="mt-0.5 break-words text-sm font-medium text-slate-700">
          {value || 'Not set'}
        </p>
      </div>
    </div>
  )
}

export default function OverviewPage() {
  const { patient, treatments } = usePatient()
  const [profileOpen, setProfileOpen] = useState(false)

  const stats = useMemo(() => {
    const sorted = [...treatments].sort(
      (a, b) => new Date(b.startTime) - new Date(a.startTime),
    )
    const ongoing = treatments.filter(
      (treatment) =>
        getTreatmentStatus(treatment.startTime, treatment.endTime).label ===
        'Ongoing',
    ).length
    const doctors = new Set(treatments.map((treatment) => treatment.doctorId))
    const latest = sorted[0] ?? null

    return {
      total: treatments.length,
      ongoing,
      doctors: doctors.size,
      latest,
      recent: sorted.slice(0, 4),
    }
  }, [treatments])

  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = patient.fullName.split(' ')[0]

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-6 py-8 text-white shadow-xl shadow-slate-900/10 sm:px-8 sm:py-10">
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-teal-400/10 blur-3xl" />

        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-200 ring-1 ring-inset ring-white/10">
              Patient health record
            </span>
            <span className="text-[11px] text-slate-400">
              Signed in as {patient.fullName}
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {greeting}, {firstName}.
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
            Your treatments, prescriptions and diagnostic documents are
            collected in one private workspace on this device.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to="/treatments?new=1"
              className={buttonClasses({
                variant: 'primary',
                size: 'md',
                className: 'shadow-lg shadow-emerald-950/20',
              })}
            >
              <Plus className="h-4 w-4" />
              Add a treatment
            </Link>
            <Link
              to="/treatments"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Open records
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-7 flex flex-wrap gap-2 text-[11px] text-slate-300">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 ring-1 ring-inset ring-white/10">
              <Droplets className="h-3.5 w-3.5 text-emerald-300" />
              Blood group {patient.bloodGroup || 'not set'}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 ring-1 ring-inset ring-white/10">
              <CalendarClock className="h-3.5 w-3.5 text-emerald-300" />
              Born {formatDateOnly(patient.dateOfBirth)}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 ring-1 ring-inset ring-white/10">
              <Phone className="h-3.5 w-3.5 text-emerald-300" />
              {patient.phone || 'No phone added'}
            </span>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={ClipboardList}
          label="Total records"
          value={stats.total}
          detail="Treatments stored on this device"
          tone="emerald"
        />
        <StatCard
          icon={Activity}
          label="Ongoing"
          value={stats.ongoing}
          detail="Treatments currently in progress"
          tone="amber"
        />
        <StatCard
          icon={Stethoscope}
          label="Care team"
          value={stats.doctors}
          detail="Doctors in your treatment history"
          tone="sky"
        />
        <StatCard
          icon={CalendarClock}
          label="Latest visit"
          value={stats.latest ? formatDate(stats.latest.startTime) : '—'}
          detail={
            stats.latest
              ? stats.latest.disease
              : 'Add a treatment to get started'
          }
          tone="violet"
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="overflow-hidden lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Recent treatments
              </h2>
              <p className="text-xs text-slate-500">
                Latest consultations and prescriptions
              </p>
            </div>
            <Link
              to="/treatments"
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
            >
              View all records
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {stats.recent.length ? (
            <ul className="divide-y divide-slate-100">
              {stats.recent.map((treatment) => (
                <li key={treatment.id}>
                  <Link
                    to={`/treatments/${treatment.id}`}
                    className="flex items-center gap-4 px-5 py-4 transition hover:bg-slate-50/80"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-100">
                      <Activity className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {treatment.disease}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        {treatment.doctorName} ·{' '}
                        {formatDateTime(treatment.startTime)}
                      </p>
                    </div>
                    <TreatmentStatus
                      startTime={treatment.startTime}
                      endTime={treatment.endTime}
                    />
                    <ChevronRight className="hidden h-4 w-4 shrink-0 text-slate-300 sm:block" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={ClipboardList}
              title="No treatments recorded"
              description="Your recent visits will appear here once you add a treatment."
              action={
                <Link
                  to="/treatments?new=1"
                  className={buttonClasses({ size: 'sm' })}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add treatment
                </Link>
              }
            />
          )}
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-bold text-slate-900">
              Patient profile
            </h2>
            <button
              type="button"
              onClick={() => setProfileOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </button>
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-inset ring-slate-100">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
              {getInitials(patient.fullName)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900">
                {patient.fullName}
              </p>
              <p className="truncate text-xs text-slate-500">
                @{patient.username} · Patient
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <ProfileRow
              icon={CalendarClock}
              label="Date of birth"
              value={formatDateOnly(patient.dateOfBirth)}
            />
            <ProfileRow
              icon={Droplets}
              label="Blood group"
              value={patient.bloodGroup}
            />
            <ProfileRow
              icon={Phone}
              label="Emergency contact"
              value={patient.emergencyContact}
            />
            <ProfileRow
              icon={UserRound}
              label="Known allergies"
              value={patient.allergies}
            />
            <ProfileRow
              icon={Activity}
              label="Ongoing conditions"
              value={patient.conditions}
            />
          </div>
        </Card>
      </div>

      <ProfileEditModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
      />
    </div>
  )
}
