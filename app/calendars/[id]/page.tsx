import CalendarGrid from "./CalendarGrid"
import Link from "next/link"

type Calendar = {
  id: number
  name: string
  type: "GLOBAL" | "CUSTOM"
}

/* API CALLS */
async function getCalendar(id: string): Promise<Calendar> {
  const res = await fetch(`http://localhost:3000/api/calendars/${id}`, {
    cache: "no-store",
  })

  if (!res.ok) throw new Error("Calendar not found")
  return res.json()
}

/* PAGE COMPONENT */
export default async function CalendarPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const calendar = await getCalendar(id)

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 text-center">
      {/* Header con Home e Aggiungi Festa */}
      <div className="flex justify-between items-center mb-6">
        <Link
          href="/"
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          ⬅ Home
        </Link>

        <h1 className="text-3xl font-bold">{calendar.name}</h1>

        <Link
          href={`/calendars/${calendar.id}/add-holiday`}
          className="px-3 py-1 bg-green-200 rounded hover:bg-green-300"
        >
          ➕ Aggiungi Festa
        </Link>
      </div>

      <p className="text-sm text-gray-500">Tipo: {calendar.type}</p>

      {/* Client component: gestione giorni e navigazione mesi */}
      <CalendarGrid calendarId={calendar.id} />
    </div>
  )
}
