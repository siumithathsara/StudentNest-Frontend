type LogoProps = {
  size?: "sm" | "md" | "lg"
  showText?: boolean
  className?: string
}

const sizes = {
  sm: { icon: "h-8 w-8", text: "text-lg" },
  md: { icon: "h-10 w-10", text: "text-xl" },
  lg: { icon: "h-14 w-14", text: "text-3xl" }
}

const Logo = ({ size = "md", showText = true, className = "" }: LogoProps) => (
  <div className={`flex items-center gap-2.5 ${className}`}>
    <svg viewBox="0 0 40 40" className={sizes[size].icon} role="img" aria-label="StudentNest logo">
      <rect width="40" height="40" rx="11" fill="#f3bb8a" />
     
      <path d="M10 17.5V30a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V17.5L20 23.5Z" fill="#16302a" />
    
      <path d="M20 6L36 14L20 22L4 14Z" fill="#16302a" />
      <path d="M33 15.6V22.5" stroke="#16302a" strokeWidth="2" strokeLinecap="round" />
      <circle cx="33" cy="24.5" r="1.9" fill="#16302a" />
      
      <rect x="17.5" y="25" width="5" height="7" rx="1.5" fill="#f3bb8a" />
    </svg>

    {showText && (
      <span className={`${sizes[size].text} font-bold tracking-tight text-sand-100`}>
        Student<span className="text-sand-400">Nest</span>
      </span>
    )}
  </div>
)

export default Logo