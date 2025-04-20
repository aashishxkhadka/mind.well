"use client";

import { MapPin, Clock, Phone, CheckCircle, Verified } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"


export default function DoctorsPage() {
  const { data: doctors, isLoading } = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const response = await axios.get("/api/doctors")
      return response.data
    },
  })

  console.log("DOCTORS", doctors)
  if (isLoading) return <div>Loading...</div>
  return (
    <div className="container py-8 px-4 mx-auto">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Find a Mental Health Professional</h1>
          <p className="text-muted-foreground">
            Connect with licensed therapists, counselors, and psychiatrists specialized in student mental health
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Input placeholder="Search by name, specialty, or location..." className="pl-4" />
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{doctors.length}</span> professionals
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <Card key={doctor.id} className="overflow-hidden bg-muted/10 ">
              <CardContent className="p-5">
                <div className="flex flex-col items-center">
                  {/* Image and Rating */}
                  <div className="relative w-full mb-3">
                    <div className="aspect-square w-32 h-32 mx-auto rounded-md overflow-hidden">
                      <Image
                        src={doctor.avatar || "/placeholder.svg"}
                        alt={doctor.name}
                        width={128}
                        height={128}
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Doctor Info */}
                  <div className="text-center mb-3">
                    <h3 className="flex items-center justify-center font-bold text-lg">{doctor.name} {doctor.isVerified && <Verified className="h-4 w-4 fill-green-600 text-lime-100 ml-2" />}</h3>
                    <p className="text-muted-foreground text-sm">{doctor.title}</p>
                    <p className="text-muted-foreground text-sm">{doctor.qualification}</p>
                  </div>

                  {/* Location */}
                  <div className="flex items-center justify-center text-sm text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{doctor.address}</span>
                  </div>

                  {/* Stats */}
                  <div className="flex justify-between w-full mt-2">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-green-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium">Experience</p>
                        <p className="text-sm">{doctor.experience}+ years</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-green-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium">Quick Contact</p>
                        <p className="text-sm">{doctor.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex gap-2">
                <Button variant="outline" className="flex-1" asChild>
                  <Link href={`/doctors/${doctor.id}`}>View Profile</Link>
                </Button>
                <Button className="flex-1" asChild>
                   <Link href={`/appointment?doctor=${doctor.id}`}>Book Session</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
