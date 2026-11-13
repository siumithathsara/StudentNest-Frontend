import type { BookingStatus } from "../types"

const styles: Record<BookingStatus, string> = {
  PENDING: "bg-sand-300 text-nest-950",
  APPROVED: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-red-100 text-red-700",
  CANCELLED: "bg-nest-100 text-nest-800"
}

const labels: Record<BookingStatus, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  CANCELLED: "Cancelled"
}

const BookingStatusBadge = ({ status }: { status: BookingStatus }) => (
  <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[status]}`}>
    {labels[status]}
  </span>
)

export default BookingStatusBadge