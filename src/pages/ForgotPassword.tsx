import { useState, type FormEvent } from "react"
import { Link } from "react-router-dom"
import AuthLayout from "../components/AuthLayout"
import { forgotPassword } from "../service/auth"
import { getErrorMessage } from "../util/errors"
import { inputClass, labelClass, primaryButtonClass } from "../util/styles"

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [done, setDone] = useState("")

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)
    try {
      const res = await forgotPassword(email)
      setDone(res.message)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <AuthLayout title="Check your email" subtitle={done} footer={null}>
        <p className="text-sm text-nest-300">
          The link works for 30 minutes. If you cannot find the email, please check your spam folder.
        </p>
        <Link to="/login" className={`${primaryButtonClass} mt-6 block text-center`}>
          Back to login
        </Link>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter your email and we will send you a link to choose a new password."
      footer={
        <Link to="/login" className="font-semibold text-sand-400 hover:underline">
          Back to login
        </Link>
      }
    >
      {error && (
        <div role="alert" className="mb-4 rounded-xl border border-red-300/30 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={submitting} className={primaryButtonClass}>
          {submitting ? "Sending..." : "Send reset link"}
        </button>
      </form>
    </AuthLayout>
  )
}

export default ForgotPassword