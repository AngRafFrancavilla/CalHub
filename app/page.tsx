"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getCalendars } from "../lib/api"

interface Calendar {
  id: number
  name: string
  type: "GLOBAL" | "CUSTOM"
}

export default function HomePage() {
  const [calendars, setCalendars] = useState<Calendar[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchCalendars = async () => {
      try {
        const data = await getCalendars()
        setCalendars(data)
      } catch (err: any) {
        setError("Failed to load calendars")
      } finally {
        setLoading(false)
      }
    }
    fetchCalendars()
  }, [])

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Caricamento calendari...
      </div>
    )
  if (error)
    return (
      <div className="flex justify-center mt-10 text-red-600">{error}</div>
    )

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-5xl font-bold mb-10 text-center text-gray-800">
        CalHub
      </h1>

      {calendars.length === 0 && (
        <div className="text-center text-gray-500 mb-6">
          Nessun calendario disponibile.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {calendars.map((cal) => (
          <Link
            key={cal.id}
            href={`/calendars/${cal.id}`}
            className="group"
          >
            <div className="relative border rounded-xl p-6 bg-white shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 cursor-pointer">
              
              <div className="absolute top-4 right-4 text-gray-300 text-3xl group-hover:text-blue-400 transition">
                📅
              </div>

              <h2 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-blue-600 transition">
                {cal.name}
              </h2>

              <span
                className={`inline-block px-3 py-1 text-sm font-medium rounded-full
                  ${
                    cal.type === "GLOBAL"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }
                `}
              >
                {cal.type === "GLOBAL" ? "Pubblico" : "Personalizzato"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
