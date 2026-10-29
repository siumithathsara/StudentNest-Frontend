type Props = {
  compact?: boolean // for mobile phone
  className?: string
}

const AuthIllustration = ({ compact = false, className }: Props) => (
  <svg
    viewBox={compact ? "55 45 290 380" : "0 0 400 440"}
    className={className}
    role="img"
    aria-label="Student working on a laptop, finding a boarding near campus"
  >
    <path d="M60 420V190a140 140 0 0 1 280 0V420Z" fill="#f6d6b6" />
    <rect x="60" y="334" width="280" height="86" fill="#29493f" />

    {/* Body */}
    <path d="M140 340C140 285 165 255 200 255C235 255 260 285 260 340Z" fill="#355a4e" />
    <rect x="190" y="236" width="20" height="26" rx="8" fill="#d49a6a" />

    {/* Head */}
    <circle cx="200" cy="198" r="37" fill="#1e3b34" />
    <circle cx="200" cy="206" r="32" fill="#d49a6a" />
    <path d="M170 200C172 178 228 178 230 200C214 190 186 190 170 200Z" fill="#1e3b34" />

    {/* Headphones */}
    <path d="M160 205A40 40 0 0 1 240 205" fill="none" stroke="#ea9f61" strokeWidth="6" strokeLinecap="round" />
    <rect x="153" y="195" width="14" height="30" rx="7" fill="#ea9f61" />
    <rect x="233" y="195" width="14" height="30" rx="7" fill="#ea9f61" />

    {/* Face */}
    <circle cx="188" cy="209" r="2.6" fill="#1e3b34" />
    <circle cx="212" cy="209" r="2.6" fill="#1e3b34" />
    <path d="M191 220Q200 228 209 220" fill="none" stroke="#1e3b34" strokeWidth="2.5" strokeLinecap="round" />

    {/* Laptop */}
    <rect x="140" y="268" width="120" height="58" rx="6" fill="#e3eee8" />
    <path d="M200 282L186 294H191V306H209V294H214Z" fill="#ea9f61" />
    <rect x="124" y="324" width="152" height="10" rx="5" fill="#a8c3b7" />
    <circle cx="152" cy="324" r="9" fill="#d49a6a" />
    <circle cx="248" cy="324" r="9" fill="#d49a6a" />

    {!compact && (
      <>
        <g transform="translate(8 108)">
          <rect width="156" height="52" rx="14" fill="#fbf4ec" />
          <circle cx="26" cy="26" r="14" fill="#ea9f61" />
          <path d="M26 17a6 6 0 0 1 6 6c0 4.5-6 10-6 10s-6-5.5-6-10a6 6 0 0 1 6-6Z" fill="#1e3b34" />
          <circle cx="26" cy="23" r="2.2" fill="#fbf4ec" />
          <text x="48" y="23" fontSize="12" fontWeight="500" fill="#1e3b34">Near your campus</text>
          <text x="48" y="40" fontSize="11" fill="#355a4e">1.2 km, 15 min walk</text>
        </g>

        <g transform="translate(240 112)">
          <rect width="152" height="52" rx="14" fill="#fbf4ec" />
          <circle cx="26" cy="26" r="14" fill="#355a4e" />
          <path d="M19 26l5 5 9-10" fill="none" stroke="#fbf4ec" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="48" y="23" fontSize="12" fontWeight="500" fill="#1e3b34">Verified owner</text>
          <text x="48" y="40" fontSize="11" fill="#355a4e">Approved by admin</text>
        </g>

        <g transform="translate(0 246)">
          <rect width="150" height="52" rx="14" fill="#fbf4ec" />
          <circle cx="26" cy="26" r="14" fill="#f3bb8a" />
          <path d="M19 26l5 5 9-10" fill="none" stroke="#1e3b34" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="48" y="23" fontSize="12" fontWeight="500" fill="#1e3b34">Booking approved</text>
          <text x="48" y="40" fontSize="11" fill="#355a4e">Your room is ready</text>
        </g>
      </>
    )}
  </svg>
)

export default AuthIllustration