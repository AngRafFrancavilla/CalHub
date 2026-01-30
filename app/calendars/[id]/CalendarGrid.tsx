"use client"
import { useState, useEffect } from "react"

type Day = {
  index: number
  dayNumber: number
  sqlDay: string
  weekDay: string
  isHoliday: boolean
}

interface CalendarGridProps {
  calendarId: number
}

export default function CalendarGrid({ calendarId }: CalendarGridProps) {
  const today = new Date().toISOString().slice(0, 10)

  // Stato per mese/anno
  const now = new Date()
  const [currentYear, setCurrentYear] = useState(now.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(now.getMonth()) // 0 = gennaio
  const [days, setDays] = useState<Day[]>([])
  const [loading, setLoading] = useState(true)

  // Funzione fetch dal server per il mese selezionato
  const fetchDays = async (year: number, month: number) => {
    setLoading(true)
    try {
      // Primo e ultimo giorno del mese
      const startOfMonth = new Date(year, month, 1)
      const endOfMonth = new Date(year, month + 1, 0)

      const res = await fetch("/api/calendars/period", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calendarId,
          dateFrom: startOfMonth.toISOString().slice(0, 10),
          dateTo: endOfMonth.toISOString().slice(0, 10),
        }),
      })
      if (!res.ok) throw new Error("Failed to fetch calendar days")
      const data: Day[] = await res.json()
      setDays(data)
    } catch (err) {
      console.error("Fetch calendar days failed:", err)
    } finally {
      setLoading(false)
    }
  }

  // Load iniziale
  useEffect(() => {
    fetchDays(currentYear, currentMonth)
  }, [calendarId, currentYear, currentMonth])

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  if (loading) return <div>Loading...</div>

  // Lunedi = prima colonna
  const jsDay = new Date(days[0]?.sqlDay).getDay()
  const firstDay = jsDay === 0 ? 6 : jsDay - 1
  const placeholders = Array.from({ length: firstDay }, (_, i) => (
    <div key={`ph-${i}`} className="p-3 border rounded bg-gray-100"></div>
  ))

  return (
    <div>
      {/* Navigazione mesi */}
      <div className="flex justify-between mb-4 items-center">
        <button
          onClick={prevMonth}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          ◀ Prev
        </button>
        <h2 className="text-lg font-bold">
          {new Date(currentYear, currentMonth).toLocaleString("default", {
            month: "long",
          })}{" "}
          {currentYear}
        </h2>
        <button
          onClick={nextMonth}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Next ▶
        </button>
      </div>

      {/* Header giorni */}
      <div className="grid grid-cols-7 text-center font-bold mb-2">
        <div>Lun</div>
        <div>Mar</div>
        <div>Mer</div>
        <div>Gio</div>
        <div>Ven</div>
        <div>Sab</div>
        <div>Dom</div>
      </div>

      {/* Griglia giorni */}
      <div className="grid grid-cols-7 gap-2">
        {placeholders}
        {days.map((day) => {
          const isToday = day.sqlDay === today
          return (
            <div
              key={day.index}
              title={day.isHoliday ? "Holiday / Closure" : "Working day"}
              onClick={() => console.log("Clicked day:", day)}
              className={`
                p-3 rounded border text-center cursor-pointer select-none
                ${
                  day.isHoliday
                    ? "bg-red-100 text-red-700 border-red-300"
                    : "bg-green-100 text-green-800 border-green-300"
                }
                ${isToday ? "ring-2 ring-blue-500" : ""}
                hover:scale-105 transition
              `}
            >
              <div className="text-xs">{day.weekDay}</div>
              <div className="text-lg font-bold">{day.dayNumber}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
