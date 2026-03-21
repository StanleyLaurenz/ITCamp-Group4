type HealthCardProps = {
  status: 'idle' | 'loading' | 'success' | 'error'
  message: string
  apiBaseUrl: string
}

const statusStyles: Record<HealthCardProps['status'], string> = {
  idle: 'border-slate-300 bg-white/80 text-slate-700',
  loading: 'border-sky-300 bg-sky-50 text-sky-900',
  success: 'border-emerald-300 bg-emerald-50 text-emerald-900',
  error: 'border-rose-300 bg-rose-50 text-rose-900',
}

export function HealthCard({ status, message, apiBaseUrl }: HealthCardProps) {
  return (
    <section className={`rounded-3xl border p-6 shadow-sm ${statusStyles[status]}`}>
      <p className="text-sm font-semibold uppercase tracking-[0.2em]">API connection</p>
      <p className="mt-3 text-lg font-medium">{message}</p>
      <p className="mt-4 text-sm">
        Backend base URL: <span className="font-semibold">{apiBaseUrl}</span>
      </p>
    </section>
  )
}
