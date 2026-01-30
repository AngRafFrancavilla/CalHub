import { prisma } from "@/lib/prisma"

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const calendarId = Number(id)

  if (isNaN(calendarId)) {
    return Response.json({ error: "Invalid id" }, { status: 400 })
  }

  const calendar = await prisma.calendar.findUnique({
    where: { id: calendarId },
  })

  if (!calendar) {
    return Response.json({ error: "Calendar not found" }, { status: 404 })
  }

  return Response.json(calendar)
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const calendarId = Number(id)

  if (isNaN(calendarId)) {
    return Response.json({ error: "Invalid id" }, { status: 400 })
  }

  const body = await req.json()
  const { name, type } = body

  try {
    const updatedCalendar = await prisma.calendar.update({
      where: { id: calendarId },
      data: {
        name,
        type,
      },
    })

    return Response.json(updatedCalendar)
  } catch {
    return Response.json({ error: "Calendar not found" }, { status: 404 })
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const calendarId = Number(id)

  if (isNaN(calendarId)) {
    return Response.json({ error: "Invalid id" }, { status: 400 })
  }

  try {
    await prisma.calendar.delete({
      where: { id: calendarId },
    })

    return Response.json({ success: true })
  } catch {
    return Response.json({ error: "Calendar not found" }, { status: 404 })
  }
}
