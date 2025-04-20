"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format, addDays, setHours, setMinutes, isBefore, isAfter } from "date-fns"
import { CalendarIcon, User, CalendarCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useMutation, useQuery } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"
import { jwtDecode } from "jwt-decode"
import { Suspense } from "react"

// Form schema
const appointmentSchema = z.object({
  doctorId: z.coerce.number().min(1, "Please select a doctor"),
  date: z.date({ required_error: "Please select a date" }),
  time: z.date({ required_error: "Please select a time" }),
  durationInMinutes: z.coerce.number().min(15, "Duration must be at least 15 minutes"),
  subject: z
    .string()
    .min(3, "Subject must be at least 3 characters")
    .max(100, "Subject must not exceed 100 characters"),
  description: z.string().max(500, "Description must not exceed 500 characters").optional(),
  contact: z.string().min(1, "Please enter your contact information"),
})

type AppointmentFormValues = z.infer<typeof appointmentSchema>

// Create a separate ClientSearchParams component
function ClientSearchParams() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const doctorId = searchParams.get("doctor") || "0";

  const { data } = useQuery({
    queryKey: ["doctor", doctorId],
    queryFn: async () => {
      const response = await axios.get(`/api/doctors/${doctorId}`);
      return response.data;
    },
  });

  const createAppointment = useMutation({
    mutationKey: ["createAppointment"],
    mutationFn: async (data: AppointmentFormValues) => {
      const response = await axios.post("/api/appointment", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Appointment booked successfully");
      router.push("/appointment/success");
    },
    onError: (error) => {
      console.error("Error booking appointment:", error);
      toast.error("Failed to book appointment");
    },
  });

  const doctor = { ...data, availableDurations: data?.availableDurations || [30, 45, 60] };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      doctorId: Number.parseInt(doctorId),
      durationInMinutes: doctor?.availableDurations[0],
      subject: "",
      description: "",
      contact: "",
    },
  });

  const watchDate = watch("date");
  const watchTime = watch("time");

  // Generate time slots based on the selected date
  const getTimeSlots = (date: Date | undefined) => {
    if (!date) return [];

    const slots = [];
    const startHour = 9;
    const endHour = 17;

    // Generate slots every 30 minutes
    for (let hour = startHour; hour < endHour; hour++) {
      for (const minute of [0, 30]) {
        const slotTime = setMinutes(setHours(new Date(date), hour), minute);

        // Skip slots in the past
        if (isBefore(slotTime, new Date())) continue;

        // Randomly make some slots unavailable (for demonstration)
        const isAvailable = Math.random() > 0.3;

        if (isAvailable) {
          slots.push({
            time: slotTime,
            available: true,
          });
        }
      }
    }

    return slots;
  };

  const timeSlots = watchDate ? getTimeSlots(watchDate) : [];

  const user = jwtDecode(localStorage.getItem("token") || "");

  const onSubmit = async (data: AppointmentFormValues) => {
    console.log("submitting form...");
    createAppointment.mutate({
      ...data,
      time: new Date(data.time.toISOString()),
      //@ts-expect-error patient id may not be required here but its working
      patientId: user?.id || 0,
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Book an Appointment</CardTitle>
          <CardDescription>Schedule a session with a mental health professional</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {/* Doctor Information */}
            <Suspense fallback={<div>Loading doctor information...</div>}>
              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={doctor?.avatar || "/placeholder.svg"} alt={doctor?.name} />
                  <AvatarFallback>
                    <User className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-lg">{doctor?.name}</h3>
                  <p className="text-muted-foreground">{doctor?.specialization}</p>
                </div>
              </div>
            </Suspense>

            {/* Date Selection */}
            <div className="space-y-2">
              <Label>Appointment Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !watchDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {watchDate ? format(watchDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={watchDate}
                    onSelect={(date) => setValue("date", date || new Date())}
                    disabled={(date) => isBefore(date, new Date()) || isAfter(date, addDays(new Date(), 30))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.date && <p className="text-sm font-medium text-destructive">{errors.date.message}</p>}
            </div>

            {/* Session Duration */}
            <div className="space-y-2">
              <Label>Session Duration</Label>
              <Select
                onValueChange={(value) => setValue("durationInMinutes", Number.parseInt(value))}
                defaultValue={doctor?.availableDurations[0].toString()}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  {doctor?.availableDurations.map((duration: number) => (
                    <SelectItem key={duration} value={duration.toString()}>
                      {duration} minutes
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.durationInMinutes && (
                <p className="text-sm font-medium text-destructive">{errors.durationInMinutes.message}</p>
              )}
            </div>

            {/* Time Slots */}
            {watchDate && (
              <div className="space-y-2">
                <Label>Available Time Slots</Label>
                {timeSlots.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {timeSlots.map((slot, index) => (
                      <Button
                        key={index}
                        type="button"
                        variant={
                          watchTime && format(watchTime, "HH:mm") === format(slot.time, "HH:mm")
                            ? "default"
                            : "outline"
                        }
                        className="h-10"
                        onClick={() => setValue("time", slot.time)}
                      >
                        {format(slot.time, "h:mm a")}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    No available slots for this date. Please select another date.
                  </p>
                )}
                {errors.time && <p className="text-sm font-medium text-destructive">{errors.time.message}</p>}
              </div>
            )}

            {/* Appointment Details */}
            <div className="space-y-2">
              <Label htmlFor="subject">Appointment Subject</Label>
              <Input
                id="subject"
                placeholder="e.g. Initial Consultation, Follow-up Session"
                {...register("subject")}
                aria-invalid={errors.subject ? "true" : "false"}
              />
              {errors.subject && <p className="text-sm font-medium text-destructive">{errors.subject.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Briefly describe what you'd like to discuss in this session"
                className="min-h-[100px]"
                {...register("description")}
                aria-invalid={errors.description ? "true" : "false"}
              />
              {errors.description && (
                <p className="text-sm font-medium text-destructive">{errors.description.message}</p>
              )}
            </div>

            {/* Patient Information */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Contact No.
              </Label>
              <Input
                id="contact"
                type="number"
                placeholder="e.g. +1234567890"
                {...register("contact")}
                aria-invalid={errors.contact ? "true" : "false"}
              />
              {errors.contact && (
                <p className="text-sm font-medium text-destructive">{errors.contact.message}</p>
              )}
            </div>

            {/* What happens next */}
            <div className="bg-muted/10 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <div className="mt-0.5">
                  <CalendarCheck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">What happens next?</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    After booking, you&apos;ll receive a confirmation email with appointment details. The healthcare
                    professional will review your request and may contact you for additional information if needed.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={() => router.push("/doctors")}>
              Cancel
            </Button>
            <Button type="submit" disabled={createAppointment.isPending}>
              {createAppointment.isPending ? "Booking..." : "Confirm Booking"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default function BookAppointmentPage() {
  return (
    <Suspense fallback={<div>Loading doctor information...</div>}>
      <ClientSearchParams />
    </Suspense>
  );
}