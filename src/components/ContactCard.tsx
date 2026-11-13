import type { BookingContact } from "../types"

const link = "font-medium text-nest-800 underline hover:text-nest-950"

const ContactCard = ({ contact }: { contact: BookingContact }) => (
  <section aria-label="Owner contact details" className="rounded-xl bg-emerald-50 p-4 text-sm text-nest-900">
    <h3 className="font-semibold text-emerald-800">Owner contact details</h3>
    <dl className="mt-2 space-y-1.5">
      {contact.ownerName && (
        <div>
          <dt className="text-nest-600">Owner</dt>
          <dd className="font-medium">{contact.ownerName}</dd>
        </div>
      )}
      {contact.phone && (
        <div>
          <dt className="text-nest-600">Phone</dt>
          <dd>
            <a href={`tel:${contact.phone}`} className={link}>
              {contact.phone}
            </a>
          </dd>
        </div>
      )}
      {contact.email && (
        <div>
          <dt className="text-nest-600">Email</dt>
          <dd className="break-all">
            <a href={`mailto:${contact.email}`} className={link}>
              {contact.email}
            </a>
          </dd>
        </div>
      )}
      <div>
        <dt className="text-nest-600">Address</dt>
        <dd className="font-medium">{contact.address}</dd>
      </div>
    </dl>
    <a
      href={`https://www.google.com/maps?q=${contact.lat},${contact.lng}`}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-3 inline-block rounded-xl bg-nest-800 px-3 py-2 font-semibold text-sand-100 hover:bg-nest-900"
    >
      Open in Google Maps
    </a>
  </section>
)

export default ContactCard