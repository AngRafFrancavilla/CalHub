import { prisma } from "@/lib/prisma"

export async function GET() {
  const holidays = await prisma.holiday.findMany()

  return Response.json(holidays)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { name, date, type, calendarId } = body

  if (!name || !date || !type || !calendarId) {
    return Response.json(
      { error: "name, type, date, calendarId are required" },
      { status: 400 }
    )
  }
    const holiday = await prisma.holiday.create({
    data: {
      name,
      date: new Date(date),
      type,
      calendarId,
    },
  })

  return Response.json(holiday, { status: 201 })
}