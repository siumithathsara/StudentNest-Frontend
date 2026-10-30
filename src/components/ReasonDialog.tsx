import { useEffect, useState, type FormEvent } from "react"
import { inputClass, labelClass, primaryButtonClass } from "../util/styles"

type Props = {
  title: string
  confirmLabel: string
  working: boolean
  error: string
  onConfirm: (reason: string) => void
  onCancel: () => void
}

const ReasonDialog = ({ title, confirmLabel, working, error, onConfirm, onCancel }: Props) => {
  const [reason, setReason] = useState("")

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onCancel()
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [onCancel])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    onConfirm(reason.trim())
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-label={title}>
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-nest-800 p-6 shadow-xl">
        <h2 className="text-xl font-bold text-sand-100">{title}</h2>

        {error && (
          <div role="alert" className="mt-4 rounded-xl border border-red-300/30 bg-red-500/10 p-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <label htmlFor="reason" className={`${labelClass} mt-4`}>Reason (the user will see this)</label>
        <textarea
          id="reason"
          autoFocus
          rows={3}
          className={inputClass}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />

        <div className="mt-5 flex gap-3">
          <button type="button" onClick={onCancel} className="w-full rounded-xl border border-nest-300/40 py-3 font-semibold text-sand-100 hover:bg-nest-700">
            Cancel
          </button>
          <button type="submit" disabled={working} className={primaryButtonClass}>
            {working ? "Saving..." : confirmLabel}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ReasonDialog