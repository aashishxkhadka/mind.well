"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ChevronLeft, ChevronRight, LinkIcon, User, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"

// Define the form schema for each step
const stepOneSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
})

const stepTwoSchema = z.object({
  title: z.string().min(2, { message: "Title is required" }),
  qualification: z.string().min(2, { message: "Qualification is required" }),
  experience: z.coerce
    .number()
    .min(0, { message: "Experience must be a positive number" })
    .max(70, { message: "Experience must be less than 70 years" }),
})

const stepThreeSchema = z.object({
  address: z.string().min(5, { message: "Address is required" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
})

const stepFourSchema = z.object({
  avatar: z.string().url({ message: "Please enter a valid image URL" }).optional(),
})

// Combine all schemas for the final submission
const formSchema = stepOneSchema.merge(stepTwoSchema).merge(stepThreeSchema).merge(stepFourSchema)

type FormValues = z.infer<typeof formSchema>

export default function DoctorSignupPage() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      name: "",
      title: "",
      qualification: "",
      experience: undefined,
      address: "",
      phone: "",
      avatar: "",
    },
  })

  const avatarUrl = watch("avatar")

  const handleNextStep = async () => {
    let fieldsToValidate: string[] = []

    switch (step) {
      case 1:
        fieldsToValidate = ["email", "password", "name"]
        break
      case 2:
        fieldsToValidate = ["title", "qualification", "experience"]
        break
      case 3:
        fieldsToValidate = ["address", "phone"]
        break
    }

    const isStepValid = await trigger(fieldsToValidate as any)
    if (isStepValid) {
      setStep((prev) => prev + 1)
    }
  }

  const handlePreviousStep = () => {
    setStep((prev) => prev - 1)
  }


  const doctorSignup = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await axios.post("/api/signup/doctor", data)
      return response.data
    },
    onSuccess: () => {
      toast.success("Account created successfully")
      setIsLoading(false)
      router.push("/")
    },
    onError: () => {
      toast.error("Failed to create account")
      setIsLoading(false)
    },
  })
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true)
    doctorSignup.mutate(data)
  }

  return (
    <div className="container flex py-16 items-center justify-center">
      <Card className="w-full min-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Healthcare Professional Registration</CardTitle>
          <CardDescription>Create your account to provide mental health support to students</CardDescription>

          {/* Step indicator */}
          <div className="w-full mt-4">
            <div className="flex justify-between mb-2">
              <span className="text-xs font-medium">Account</span>
              <span className="text-xs font-medium">Professional</span>
              <span className="text-xs font-medium">Contact</span>
              <span className="text-xs font-medium">Profile</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              ></div>
            </div>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="doctor@example.com"
                    {...register("email")}
                    aria-invalid={errors.email ? "true" : "false"}
                  />
                  {errors.email && <p className="text-sm font-medium text-destructive">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Dr. Jane Smith"
                    {...register("name")}
                    aria-invalid={errors.name ? "true" : "false"}
                  />
                  {errors.name && <p className="text-sm font-medium text-destructive">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    {...register("password")}
                    aria-invalid={errors.password ? "true" : "false"}
                  />
                  {errors.password && <p className="text-sm font-medium text-destructive">{errors.password.message}</p>}
                </div>
              </div>
            )}

            {/* Step 2: Professional Details */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Professional Title</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="e.g. Psychiatrist, Psychologist, Therapist"
                    {...register("title")}
                    aria-invalid={errors.title ? "true" : "false"}
                  />
                  {errors.title && <p className="text-sm font-medium text-destructive">{errors.title.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qualification">Qualifications</Label>
                  <Input
                    id="qualification"
                    type="text"
                    placeholder="e.g. MD, PhD in Psychology, Licensed Therapist"
                    {...register("qualification")}
                    aria-invalid={errors.qualification ? "true" : "false"}
                  />
                  {errors.qualification && (
                    <p className="text-sm font-medium text-destructive">{errors.qualification.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    min="0"
                    max="70"
                    placeholder="e.g. 5"
                    {...register("experience")}
                    aria-invalid={errors.experience ? "true" : "false"}
                  />
                  {errors.experience && (
                    <p className="text-sm font-medium text-destructive">{errors.experience.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Contact Information */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Practice Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter your practice address"
                    {...register("address")}
                    aria-invalid={errors.address ? "true" : "false"}
                  />
                  {errors.address && <p className="text-sm font-medium text-destructive">{errors.address.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Contact Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="e.g. +1 (555) 123-4567"
                    {...register("phone")}
                    aria-invalid={errors.phone ? "true" : "false"}
                  />
                  {errors.phone && <p className="text-sm font-medium text-destructive">{errors.phone.message}</p>}
                </div>
              </div>
            )}

            {/* Step 4: Profile Picture */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="flex flex-col items-center justify-center gap-4">
                  <Avatar className="w-32 h-32">
                    {avatarUrl ? (
                      <AvatarImage src={avatarUrl || "/placeholder.svg"} alt="Profile preview" />
                    ) : (
                      <AvatarFallback>
                        <User className="h-16 w-16 text-muted-foreground" />
                      </AvatarFallback>
                    )}
                  </Avatar>

                  <div className="space-y-2 w-full">
                    <Label htmlFor="avatar">Profile Picture URL</Label>
                    <div className="flex items-center gap-2">
                      <LinkIcon className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="avatar"
                        type="url"
                        placeholder="https://example.com/your-profile-image.jpg"
                        {...register("avatar")}
                        aria-invalid={errors.avatar ? "true" : "false"}
                      />
                    </div>
                    {errors.avatar && <p className="text-sm font-medium text-destructive">{errors.avatar.message}</p>}
                    <p className="text-xs text-muted-foreground">Enter a URL to an image for your profile picture</p>
                  </div>
                </div>

                <div className="space-y-2 bg-yellow-500/30 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Verification Required</h3>
                      <p className="text-xs text-foreground">
                        After registration, our team will verify your credentials before your profile is activated.
                        You'll receive an email once your account is verified.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between pt-4">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={handlePreviousStep}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            ) : (
              <Button type="button" variant="outline" asChild>
                <Link href="/register">Regular Signup</Link>
              </Button>
            )}

            {step < 4 ? (
              <Button type="button" onClick={handleNextStep}>
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Complete Registration"}
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
