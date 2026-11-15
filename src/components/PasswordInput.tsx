import { useState } from "react"
import { inputClass } from "../util/styles"
import { EyeIcon, EyeOffIcon } from "./icons"

type Props = {
  id: string
  value: string
  onChange: (value: string) => void
  autoComplete: "current-password" | "new-password"
  placeholder?: string
  required?: boolean
  describedBy?: string
}

const PasswordInput = ({ id, value, onChange, autoComplete, placeholder, required, describedBy }: Props) => {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required={required}
        aria-describedby={describedBy}
        className={`${inputClass} pr-12`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        className="absolute inset-y-0 right-0 grid w-12 place-items-center rounded-r-xl text-nest-300 transition hover:text-sand-100"
      >
        {visible ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  )
}

export default PasswordInput