import { useEffect, useState, type FormEvent } from "react"
import { inputClass, labelClass, primaryButtonClass } from "../util/styles"

type Props = {
  boardingTitle: string
  working: boolean
  error: string
  onConfirm: (values: { moveInDate: string; message?: string }) => void
  onCancel: () => void
}

const MAX_MESSAGE = 300
// 2026-11-28
const toInputDate = (d: Date) => d.toLocaleDateString("en-CA")

const RequestDialog = ({ boardingTitle, working, error, onConfirm, onCancel }: Props) => {
  const [moveInDate, setMoveInDate] = useState("")
  const [message, setMessage] = useState("")

  const today = new Date()
  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + 365)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onCancel()
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [onCancel])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    onConfirm({ moveInDate, message: message.trim() || undefined })
  }

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Request a room"
    >
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-nest-800 p-6 shadow-xl">
        <h2 className="text-xl font-bold text-sand-100">Request a room</h2>
        <p className="mt-1 text-sm text-nest-300">{boardingTitle}</p>

        {error && (
          <div role="alert" className="mt-4 rounded-xl border border-red-300/30 bg-red-500/10 p-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <label htmlFor="moveInDate" className={`${labelClass} mt-4`}>
          Move-in date
        </label>
        <input
          id="moveInDate"
          type="date"
          required
          autoFocus
          min={toInputDate(today)}
          max={toInputDate(maxDate)}
          className={inputClass}
          value={moveInDate}
          onChange={(e) => setMoveInDate(e.target.value)}
        />

        <label htmlFor="bookingMessage" className={`${labelClass} mt-4`}>
          Message to the owner (optional)
        </label>
        <textarea
          id="bookingMessage"
          rows={3}
          maxLength={MAX_MESSAGE}
          className={inputClass}
          placeholder="Introduce yourself, your campus, how long you plan to stay..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <p className="mt-1 text-right text-xs text-nest-300">
          {message.length}/{MAX_MESSAGE}
        </p>

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="w-full rounded-xl border border-nest-300/40 py-3 font-semibold text-sand-100 hover:bg-nest-700"
          >
            Cancel
          </button>
          <button type="submit" disabled={working} className={primaryButtonClass}>
            {working ? "Sending..." : "Send request"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default RequestDialog