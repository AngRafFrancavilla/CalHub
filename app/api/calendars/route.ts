import { prisma } from "@/lib/prisma"

export async function GET() {
  const calendars = await prisma.calendar.findMany()

  return Response.json(calendars)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { name, type } = body

  if (!name || !type) {
    return Response.json(
      { error: "name and type are required" },
      { status: 400 }
    )
  }

  const calendar = await prisma.calendar.create({
    data: {
      name,
      type,
    },
  })

  return Response.json(calendar, { status: 201 })
}