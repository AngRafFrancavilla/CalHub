import { getCalendarPeriod } from "@/lib/services/calendar.service"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { calendarId, dateFrom, dateTo } = body

    if (!calendarId || !dateFrom || !dateTo) {
      return Response.json(
        { error: "calendarId, dateFrom and dateTo are required" },
        { status: 400 }
      )
    }

    const days = await getCalendarPeriod(calendarId, dateFrom, dateTo)
    return Response.json(days)
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
