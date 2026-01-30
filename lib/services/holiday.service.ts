import { prisma } from "@/lib/prisma"
import { HolidayType } from "@prisma/client"

export const getAllHolidays = async () => {
  return prisma.holiday.findMany()
}

export const getHolidayById = async (id: number) => {
  return prisma.holiday.findUnique({
    where: { id },
  })
}

export const createHoliday = async (data: { 
    name: string 
    date: Date
    type: HolidayType 
    calendarId: number 
}) => {
  
    return prisma.holiday.create({
        data: {
            name: data.name,
            date: data.date,
            type: data.type,
            calendarId: data.calendarId,
        }, 
    })
}

export const updateHoliday = async (
    id: number, 
    data: { 
        name?: string; 
        type?: HolidayType 
    }
) => {
  return prisma.holiday.update({
    where: { id },
    data,
  })
}

export const deleteHoliday = async (id: number) => {
  return prisma.holiday.delete({
    where: { id },
  })
}