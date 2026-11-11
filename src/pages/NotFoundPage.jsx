import { Link } from 'react-router-dom'
import { ArrowLeft, FileQuestion } from 'lucide-react'
import Card from '../components/ui/Card'
import { buttonClasses } from '../components/ui/Button'

export default function NotFoundPage() {
  return (
    <Card className="mx-auto max-w-lg px-6 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        <FileQuestion className="h-6 w-6" />
      </div>
      <h1 className="mt-5 text-xl font-bold text-slate-900">Page not found</h1>
      <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
        The page you are looking for does not exist in the current patient
        workspace.
      </p>
      <Link
        to="/"
        className={buttonClasses({ size: 'sm', className: 'mt-6' })}
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to overview
      </Link>
    </Card>
  )
}
