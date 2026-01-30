export const getCalendars = async () => {
  const res = await fetch("/api/calendars")
  if (!res.ok) throw new Error("Failed to fetch calendars")
  return res.json()
}

