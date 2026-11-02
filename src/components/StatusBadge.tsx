import type { BoardingStatus } from "../types"

const styles: Record<BoardingStatus, string> = {
  PENDING: "bg-sand-300 text-nest-950",
  APPROVED: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-red-100 text-red-700"
}

const labels: Record<BoardingStatus, string> = {
  PENDING: "Pending approval",
  APPROVED: "Approved",
  REJECTED: "Rejected"
}

const StatusBadge = ({ status }: { status: BoardingStatus }) => (
  <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[status]}`}>
    {labels[status]}
  </span>
)

export default StatusBadge