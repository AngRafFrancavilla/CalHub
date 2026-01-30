"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface AddHolidayFormProps {
  calendarId: string
}

export default function AddHolidayForm({ calendarId }: AddHolidayFormProps) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [type, setType] = useState<"HOLIDAY" | "CLOSURE">("HOLIDAY")
  const [date, setDate] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/holidays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calendarId: Number(calendarId),
          name,
          type,  
          date,
        }),
      })

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}))
        throw new Error(errJson.error || "Failed to add holiday")
      }

      // Torna alla pagina del calendario
      router.push(`/calendars/${calendarId}`)
    } catch (err: any) {
      console.error("Failed to add holiday", err)
      setError(err.message || "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Aggiungi Festa</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-red-600">{error}</div>}

        <div>
          <label className="block text-sm font-medium">Nome Festa</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Tipo Festa</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "HOLIDAY" | "CLOSURE")}
            className="w-full border rounded p-2"
          >
            <option value="HOLIDAY">Festa Pubblica</option>
            <option value="CLOSURE">Chiusura Personalizzata</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Data</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? "Salvando..." : "Aggiungi Festa"}
        </button>
      </form>
    </div>
  )
}
