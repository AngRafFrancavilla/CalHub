import AddHolidayForm from "./AddHolidayForm"

interface AddHolidayPageProps {
  params: Promise<{ id: string }>
}

export default async function AddHolidayPage({ params }: AddHolidayPageProps) {
  const { id } = await params // ✅ await per sbloccare il Promise
  return <AddHolidayForm calendarId={id} />
}
