"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { jwtDecode } from "jwt-decode"
import { format } from "date-fns"
import { Check, X, Phone, Mail, MapPin, Clock, Calendar, FileText, CheckCircle, XCircle } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface UserToken {
  id: number
  email: string
  // add other token fields as needed
}

export default function ProfilePage() {
  const token = localStorage?.getItem("token") || ""
  const user = token ? (jwtDecode(token) as UserToken) : null
  const router = useRouter()

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!user?.id) throw new Error("User not found")
      const response = await axios.get(`/api/profile/${user.id}`)
      return response.data
    },
    enabled: !!user?.id
  })

  const { data: appointments, isLoading: isAppointmentsLoading } = useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      if (!user?.id) throw new Error("User not found")
      const response = await axios.get(`/api/appointment/${user.id}`)
      return response.data
    },
    enabled: !!user?.id
  })
  const queryClient = useQueryClient()

  const handleLogout = () => {
    localStorage.removeItem("token")
    toast.success("Logged out successfully")
    window.location.href = "/"
  }

  if (!user) {
    return (
      <div className="container flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Please log in to view your profile</div>
      </div>
    )
  }

  if (isLoading || isAppointmentsLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  const handleAppointmentAction = async (appointmentId: number, action: 'confirm' | 'cancel') => {
    try {
      await axios.patch(`/api/appointment`, { id: appointmentId, status: action === 'confirm' ? 'CONFIRMED' : 'CANCELLED' })
      toast.success('Appointment status changed')
      queryClient.invalidateQueries({ queryKey: ["appointments"] })
    } catch (error) {
      console.error('Failed to update appointment:', error)
    }
  }

  return (
    <div className="container py-8">
      <div className="max-w-7xl mx-auto grid grid-cols-4 gap-8">
        {/* Profile Section - Takes 1 column */}
        <div className="col-span-1">
          <Card className="sticky top-8">
            <CardHeader className="flex flex-col items-center text-center">
              <Avatar className="h-32 w-32">
                <AvatarImage src={profile?.avatar || "/placeholder.svg"} alt={profile?.name} />
                <AvatarFallback>{profile?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="mt-4">
                <CardTitle className="text-2xl">{profile?.name}</CardTitle>
                <CardDescription>{profile?.title}</CardDescription>
                <CardDescription>{profile?.qualification}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{profile?.email}</span>
                </div>
                {profile?.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{profile?.phone}</span>
                  </div>
                )}
                {profile?.address && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{profile?.address}</span>
                  </div>
                )}
                <Button variant={'destructive'} onClick={handleLogout}>Logout</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appointments Section - Takes 3 columns */}
        <div className="col-span-3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Appointments</h2>
            <Badge variant="secondary" className="text-base px-4 py-1">
              {appointments?.length || 0} Total
            </Badge>
          </div>
          <div className="grid gap-4">
            {appointments?.map((appointment: any) => (
              <Card key={appointment.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="grid gap-1">
                        <div className="font-semibold">{appointment.subject}</div>
                        <div className="text-sm text-muted-foreground">{appointment.description}</div>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{format(new Date(appointment.start), 'MMM dd, yyyy')}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{format(new Date(appointment.start), 'hh:mm a')}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <FileText className="h-4 w-4" />
                            <span>{appointment.durationInMinutes} minutes</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={
                            appointment.status === 'CONFIRMED' ? 'default' :
                            appointment.status === 'CANCELLED' ? 'destructive' :
                                'secondary'
                          }>
                            {appointment.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          {appointment.doctorId === user.id ? (
                            <span className="text-muted-foreground">
                              Patient: <span className="font-medium text-foreground">{appointment.patient.name}</span>
                            </span>
                          ) : (
                            <span className="text-muted-foreground">
                              Doctor: <span className="font-medium text-foreground">{appointment.doctor.name}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {appointment.status === 'PENDING' && (
                        <div className="flex gap-2">
                          {appointment.doctorId === user.id && (
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 text-green-500 hover:text-green-600"
                              onClick={() => handleAppointmentAction(appointment.id, 'confirm')}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 text-destructive hover:text-destructive/80"
                            onClick={() => handleAppointmentAction(appointment.id, 'cancel')}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {appointments?.length === 0 && (
              <Card className="py-8">
                <CardContent className="flex flex-col items-center justify-center text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Appointments</h3>
                  <p className="text-muted-foreground">You don't have any appointments scheduled.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
