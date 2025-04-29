"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner";

export default function DoctorsPage() {
  const { data: doctors, isLoading, error } = useQuery({
    queryKey: ['doctors'],
    queryFn: async () => {
      const doctors = await axios.get("/api/admin/users/doctors/")
      return doctors.data
    }
  })
  const queryClient = useQueryClient()
  const deleteDoctor = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`/api/admin/users/${id}`)
      return response.data
    },
    onSuccess: () => {
      toast.success("Doctor deleted successfully")
      queryClient.invalidateQueries({ queryKey: ['doctors'] })
    },
    onError: () => {
      toast.error("Failed to delete doctor")
    }
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold pb-4">Manage Doctors</h1>
      <Table>
        <TableCaption>A list of doctors registered in the system.</TableCaption>
        <TableHeader className="bg-secondary text-secondary">
          <TableRow>
            <TableHead className="w-[100px]">Doctor ID</TableHead>
            <TableHead>Doctor Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {doctors?.map((doctor: any) => (
            <TableRow key={doctor.id} className="hover:bg-secondary">
              <TableCell className="font-medium">{doctor.id.toString().slice(0, 6)}</TableCell>
              <TableCell>{doctor.name}</TableCell>
              <TableCell>{doctor.email}</TableCell>
              <TableCell>{doctor.phone}</TableCell>
              <TableCell>{doctor.experience}</TableCell>
              <TableCell>{doctor.address}</TableCell>
              <TableCell className="flex gap-2">
                <Button variant="outline">Verify Doctor</Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      {deleteDoctor.isPending ? "Deleting..." : "Delete"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the doctor from the system.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteDoctor.mutate(doctor.id)}>{deleteDoctor.isPending ? "Deleting..." : "Delete"}</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}