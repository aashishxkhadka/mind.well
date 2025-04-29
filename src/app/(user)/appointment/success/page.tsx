import Link from "next/link"
import { CalendarCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function AppointmentSuccessPage() {
  return (
    <div className="container flex py-16 items-center justify-center">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CalendarCheck className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Appointment Booked!</CardTitle>
          <CardDescription>Your appointment has been successfully scheduled</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              We've sent a confirmation email with all the details of your appointment. You can also view your upcoming
              appointments in your dashboard.
            </p>
            <p className="text-sm text-muted-foreground">
              If you need to reschedule or cancel, please do so at least 24 hours before your appointment.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/profile">View My Appointments</Link>
          </Button>
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
