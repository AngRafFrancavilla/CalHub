import { prisma } from "@/lib/prisma"
import { CalendarType } from "@prisma/client"

export const getCalendarPeriod = async (
  calendarId: number,
  dateFrom: string,
  dateTo: string
) => {
  const start = new Date(dateFrom)
  const end = new Date(dateTo)

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error("Invalid dateFrom or dateTo")
  }

  // Prende tutti i festivi globali
  const globalHolidays = await prisma.holiday.findMany({
    where: {
      calendar: {
        type: CalendarType.GLOBAL,
      },
    },
  })

  //Prende tutti i festivi custom per il calendario scelto
  const customHolidays = await prisma.holiday.findMany({
    where: {
      calendarId,
    },
  })

  // Combina i due array
  const allHolidaysCombined = [...globalHolidays, ...customHolidays]

  //  "YYYY-MM-DD" per i tooltip
  const allHolidaysObj: Record<string, { name: string; type: string }> = {}
  allHolidaysCombined.forEach(h => {
    const sqlDay = h.date.toISOString().slice(0, 10)
    allHolidaysObj[sqlDay] = { name: h.name, type: h.type }
  })

  // genera lista
  const days = []
  let current = new Date(start)
  let index = 0

  while (current <= end) {
    const yyyy = current.getFullYear()
    const mm = current.getMonth() + 1
    const dd = current.getDate()

    const sqlDay = current.toISOString().slice(0, 10)
    const weekDay = current.toLocaleDateString("en-US", { weekday: "long" })
    const weekNr = getWeekNumber(current)

    const weekDayNumber = current.getDay() 
    const isSunday = weekDayNumber === 0

    days.push({
      index,
      dayNumber: dd,
      dayMonth: mm,
      dayYear: yyyy,
      sqlDay,
      weekDay,
      weekNr,
      isHoliday: isSunday || sqlDay in allHolidaysObj,
    })

    current.setDate(current.getDate() + 1)
    index++
  }

  return days
}

function getWeekNumber(d: Date) {
  const date = new Date(d.getTime())
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7))
  const week1 = new Date(date.getFullYear(), 0, 4)
  return (
    1 +
    Math.round(
      ((date.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7
    )
  )
}
