import { useState, type FormEvent } from "react"
import { Link, useSearchParams } from "react-router-dom"
import AuthLayout from "../components/AuthLayout"
import PasswordInput from "../components/PasswordInput"
import { resetPassword } from "../service/auth"
import { getErrorMessage } from "../util/errors"
import { labelClass, primaryButtonClass } from "../util/styles"

const ResetPassword = () => {
  const [params] = useSearchParams()
  const token = params.get("token") ?? ""

  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("") 
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [done, setDone] = useState("")

  const mismatch = confirm.length > 0 && confirm !== password

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    if (password !== confirm) {
      setError("Passwords do not match.")
      return
    }
    setSubmitting(true)
    try {
      const res = await resetPassword(token, password)
      setDone(res.message)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  if (!token) {
    return (
      <AuthLayout title="Invalid link" subtitle="This password reset link is not valid." footer={null}>
        <Link to="/forgot-password" className={`${primaryButtonClass} block text-center`}>
          Request a new link
        </Link>
      </AuthLayout>
    )
  }

  if (done) {
    return (
      <AuthLayout title="Password updated" subtitle={done} footer={null}>
        <Link to="/login" className={`${primaryButtonClass} block text-center`}>
          Go to login
        </Link>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Choose a new password"
      subtitle="Use at least 8 characters, with a letter and a number."
      footer={
        <Link to="/login" className="font-semibold text-sand-400 hover:underline">
          Back to login
        </Link>
      }
    >
      {error && (
        <div role="alert" className="mb-4 rounded-xl border border-red-300/30 bg-red-500/10 p-3 text-sm text-red-200">
          {error}{" "}
          {error.toLowerCase().includes("expired") && (
            <Link to="/forgot-password" className="font-semibold underline">
              Request a new link
            </Link>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label htmlFor="new-password" className={labelClass}>
            New password
          </label>
          <PasswordInput id="new-password" autoComplete="new-password" value={password} onChange={setPassword} required />
        </div>
        <div>
          <label htmlFor="confirm-password" className={labelClass}>
            Confirm new password
          </label>
          <PasswordInput
            id="confirm-password"
            autoComplete="new-password"
            value={confirm}
            onChange={setConfirm}
            describedBy={mismatch ? "confirm-error" : undefined}
            required
          />
          {mismatch && (
            <p id="confirm-error" role="alert" className="mt-1.5 text-xs text-red-300">
              Passwords do not match.
            </p>
          )}
        </div>
        <button type="submit" disabled={submitting} className={primaryButtonClass}>
          {submitting ? "Saving..." : "Update password"}
        </button>
      </form>
    </AuthLayout>
  )
}

export default ResetPassword