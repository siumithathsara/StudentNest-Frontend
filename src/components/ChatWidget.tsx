import { useEffect, useRef, useState, type FormEvent } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { sendMessage } from "../store/chatSlice"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { getSavedCampus } from "../util/campusPref"
import { formatRent } from "../util/format"
import { CloseIcon } from "./icons"

const MAX = 500

const WELCOME = {
  STUDENT: {
    text: "Hi! 👋 I can find boardings by budget, facilities or distance to your campus, and explain how things work.",
    chips: ["Cheapest boarding near my campus", "Boardings with WiFi and meals", "How do I book a room?"]
  },
  OWNER: {
    text: "Hi! 👋 I can help you list your boarding and handle booking requests.",
    chips: ["How do I add a boarding?", "How do booking requests work?", "Why is my boarding not visible?"]
  },
  ADMIN: {
    text: "Hi! 👋 I can explain approvals, campuses and the dashboard.",
    chips: ["How do I approve a user?", "How do I add a campus?", "What does the dashboard show?"]
  }
}

const BotIcon = ({ className, eye = "#fbf4ec" }: { className?: string; eye?: string }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    <path d="M16 3.5v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="16" cy="3.2" r="1.8" fill="currentColor" />
    <rect x="2" y="14" width="3" height="6" rx="1.5" fill="currentColor" />
    <rect x="27" y="14" width="3" height="6" rx="1.5" fill="currentColor" />
    <rect x="5" y="8" width="22" height="17" rx="7" fill="currentColor" />
    <circle cx="12" cy="16" r="2.2" fill={eye} />
    <circle cx="20" cy="16" r="2.2" fill={eye} />
    <path d="M12.5 20.4c1.8 1.6 5.2 1.6 7 0" stroke={eye} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const SendIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M3.4 20.4 21 12 3.4 3.6 3.3 10l12.6 2-12.6 2z" fill="currentColor" />
  </svg>
)

const Avatar = () => (
  <span className="mb-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-nest-800 text-sand-100">
    <BotIcon className="h-5 w-5" eye="#29493f" />
  </span>
)

const Chips = ({ items, onPick }: { items: string[]; onPick: (s: string) => void }) => (
  <div className="flex flex-wrap gap-2">
    {items.map((s) => (
      <button
        key={s}
        onClick={() => onPick(s)}
        className="rounded-full border border-nest-600/40 bg-white px-3.5 py-1.5 text-xs font-medium text-nest-800 shadow-sm transition hover:bg-nest-800 hover:text-sand-100"
      >
        {s}
      </button>
    ))}
  </div>
)

const ChatWidget = () => {
  const { user } = useAuth()
  const dispatch = useAppDispatch()
  const { messages, loading } = useAppSelector((s) => s.chat)
  const compareCount = useAppSelector((s) => s.compare.ids.length)

  const [open, setOpen] = useState(false)
  const [text, setText] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [messages, loading, open])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [open])

  if (!user) return null

  const welcome = WELCOME[user.role]
  const isStudent = user.role === "STUDENT"

  const send = (value: string) => {
    const t = value.trim()
    if (!t || loading) return
    const history = messages
      .filter((m) => !m.isError)
      .slice(-6)
      .map((m) => ({ role: m.role, text: m.text }))
    dispatch(sendMessage({ text: t, history, campusId: isStudent ? getSavedCampus() : undefined }))
    setText("")
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    send(text)
  }

  const close = () => {
    setOpen(false)
    toggleRef.current?.focus()
  }

  return (
    <>
    
      <button
        ref={toggleRef}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat assistant" : "Open chat assistant"}
        aria-expanded={open}
        className={`fixed right-4 z-40 h-16 w-16 place-items-center rounded-full bg-linear-to-br from-sand-300 to-sand-500 text-nest-950 shadow-xl ring-4 ring-white/10 transition hover:scale-105 sm:right-6 ${
          isStudent && compareCount > 0 ? "bottom-24" : "bottom-6"
        } ${open ? "hidden sm:grid" : "grid"}`}
      >
        {!open && messages.length === 0 && (
          <span className="absolute inset-0 animate-ping rounded-full bg-sand-400/40" aria-hidden="true" />
        )}
        <BotIcon className="relative h-9 w-9" />
        <span className="absolute right-1 top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400" aria-hidden="true" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Chat assistant"
          className="chat-pop fixed inset-0 z-50 flex flex-col overflow-hidden bg-white text-nest-900 shadow-2xl sm:inset-auto sm:bottom-24 sm:right-6 sm:h-[36rem] sm:max-h-[calc(100dvh-8rem)] sm:w-[25rem] sm:rounded-3xl"
        >
         
          <div className="flex items-center gap-3 bg-linear-to-r from-nest-800 to-nest-900 px-4 py-4 text-sand-100">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-sand-100 text-nest-800">
              <BotIcon className="h-7 w-7" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold leading-tight">Assistant</p>
              <p className="flex items-center gap-1.5 text-xs text-nest-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
                Online · 
              </p>
            </div>
            <button onClick={close} aria-label="Close chat assistant" className="rounded-lg p-1.5 hover:bg-white/10">
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

         
          <div role="log" aria-live="polite" className="flex-1 space-y-4 overflow-y-auto bg-nest-100/70 p-4">
            {messages.length === 0 && (
              <div className="flex items-end gap-2">
                <Avatar />
                <div className="space-y-3">
                  <p className="rounded-2xl rounded-tl-md bg-white px-4 py-2.5 text-sm shadow-sm">{welcome.text}</p>
                  <Chips items={welcome.chips} onPick={send} />
                </div>
              </div>
            )}

            {messages.map((m, i) => {
              const isLast = i === messages.length - 1
              if (m.role === "user") {
                return (
                  <div key={m.id} className="flex justify-end">
                    <p className="max-w-[80%] whitespace-pre-line rounded-2xl rounded-tr-md bg-linear-to-br from-nest-700 to-nest-900 px-4 py-2.5 text-sm text-sand-100 shadow-sm">
                      {m.text}
                    </p>
                  </div>
                )
              }
              return (
                <div key={m.id} className="flex items-end gap-2">
                  <Avatar />
                  <div className="min-w-0 max-w-[85%] space-y-2">
                    <p
                      className={`whitespace-pre-line rounded-2xl rounded-tl-md px-4 py-2.5 text-sm shadow-sm ${
                        m.isError ? "bg-red-50 text-red-700" : "bg-white"
                      }`}
                    >
                      {m.text}
                    </p>

                    {m.boardings && m.boardings.length > 0 && (
                      <ul className="space-y-2">
                        {m.boardings.map((b) => (
                          <li key={b.id}>
                            <Link
                              to={`/boardings/${b.id}${m.campus ? `?campus=${m.campus.id}` : ""}`}
                              onClick={() => setOpen(false)}
                              className="flex gap-3 rounded-xl bg-white p-2 shadow-sm transition hover:bg-sand-100"
                            >
                              {b.coverImage ? (
                                <img src={b.coverImage} alt="" loading="lazy" className="h-16 w-20 rounded-lg object-cover" />
                              ) : (
                                <div className="grid h-16 w-20 place-items-center rounded-lg bg-nest-100 text-xs text-nest-600">
                                  No photo
                                </div>
                              )}
                              <span className="min-w-0 text-sm">
                                <span className="block truncate font-semibold">{b.title}</span>
                                <span className="block text-nest-600">{formatRent(b.monthlyRent)} / month</span>
                                <span className="block text-xs text-nest-600">
                                  {b.travel ? `${b.travel.distanceKm} km · ~${b.travel.walkMinutes} min walk · ` : ""}
                                  {b.availableRooms} rooms free
                                </span>
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}

                    {isLast && !loading && m.suggestions && m.suggestions.length > 0 && (
                      <Chips items={m.suggestions} onPick={send} />
                    )}
                  </div>
                </div>
              )
            })}

            {loading && (
              <div className="flex items-end gap-2" aria-label="The assistant is typing">
                <Avatar />
                <div className="flex gap-1.5 rounded-2xl rounded-tl-md bg-white px-4 py-3.5 shadow-sm">
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className="chat-dot h-2 w-2 rounded-full bg-nest-600"
                      style={{ animationDelay: `${d * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="border-t border-nest-100 bg-white p-3">
            <form onSubmit={submit} className="flex items-center gap-2">
              <input
                ref={inputRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={MAX}
                placeholder="Type your message..."
                aria-label="Your message"
                className="min-w-0 flex-1 rounded-full bg-nest-100 px-4 py-2.5 text-sm text-nest-900 outline-none placeholder:text-nest-600 focus:ring-2 focus:ring-nest-600"
              />
              <button
                type="submit"
                disabled={loading || !text.trim()}
                aria-label="Send message"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-nest-800 text-sand-100 transition hover:bg-nest-900 disabled:opacity-40"
              >
                <SendIcon className="h-5 w-5" />
              </button>
            </form>
            <p className="mt-2 text-center text-[11px] text-nest-600">AI answers can be wrong. Please double-check important details.</p>
          </div>
        </div>
      )}
    </>
  )
}

export default ChatWidget