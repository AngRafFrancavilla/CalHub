import { prisma } from "@/lib/prisma"

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const holidayId = Number(id)

  if (isNaN(holidayId)) {
    return Response.json({ error: "Invalid id" }, { status: 400 })
  }

  const holiday = await prisma.holiday.findUnique({
    where: { id: holidayId },
  })

  if (!holiday) {
    return Response.json({ error: "Calendar not found" }, { status: 404 })
  }

  return Response.json(holiday)
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const holidayId = Number(id)

  if (isNaN(holidayId)) {
    return Response.json({ error: "Invalid id" }, { status: 400 })
  }

  const body = await req.json()
  const { name, date, type, calendarId } = body

  try {
    const updatedHoliday = await prisma.holiday.update({
      where: { id: holidayId },
      data: {
        name,
        date,
        type,
        calendarId
      },
    })

    return Response.json(updatedHoliday)
  } catch {
    return Response.json({ error: "Holiday not found" }, { status: 404 })
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const holidayId = Number(id)

  if (isNaN(holidayId)) {
    return Response.json({ error: "Invalid id" }, { status: 400 })
  }

  try {
    await prisma.holiday.delete({
      where: { id: holidayId },
    })

    return Response.json({ success: true })
  } catch {
    return Response.json({ error: "Holiday not found" }, { status: 404 })
  }
}
