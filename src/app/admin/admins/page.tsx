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
import { LucidePlus, LucidePencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useState } from "react";

interface Admin {
  id: string;
  name: string;
  email: string;
}

export default function AdminPage() {
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const { data: admins, isLoading, error } = useQuery({
    queryKey: ['admins'],
    queryFn: async () => {
      const admins = await axios.get("/api/admin/admins/")
      return admins.data
    }
  })
  const queryClient = useQueryClient()
  const deleteUser = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`/api/admin/admins/${id}`)
      return response.data
    },
    onSuccess: () => {
      toast.success("User deleted successfully")
      queryClient.invalidateQueries({ queryKey: ['admins'] })
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete user")
    }
  })

  const { register: registerAdd, handleSubmit: handleAddSubmit } = useForm()
  const addAdmin = useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post("/api/admin/create-admin", data)
      return response.data
    },
    onSuccess: () => {
      toast.success("Admin added successfully")
      queryClient.invalidateQueries({ queryKey: ['admins'] })
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to add admin")
    }
  })

  const { register: registerEdit, handleSubmit: handleEditSubmit, reset } = useForm()
  const updateAdmin = useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.patch(`/api/admin/admins/${editingAdmin?.id}`, data)
      return response.data
    },
    onSuccess: () => {
      toast.success("Admin updated successfully")
      queryClient.invalidateQueries({ queryKey: ['admins'] })
      setEditingAdmin(null)
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update admin")
    }
  })

  const onSubmitAdd = (data: any) => {
    addAdmin.mutate(data)
  }

  const onSubmitEdit = (data: any) => {
    updateAdmin.mutate(data)
  }

  const handleEditClick = (admin: Admin) => {
    setEditingAdmin(admin)
    reset({
      name: admin.name,
      email: admin.email,
    })
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold pb-4"> Manage Admin</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button> <LucidePlus />Add Admin</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleAddSubmit(onSubmitAdd)}>
              <DialogHeader>
                <DialogTitle>Add Admin</DialogTitle>
                <DialogDescription>
                  Add a new admin to the system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Full Name
                  </Label>
                  <Input id="name" placeholder="Infomax College" className="col-span-3" {...registerAdd("name")} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Email
                  </Label>
                  <Input id="username" placeholder="admin@gmail.com" className="col-span-3" {...registerAdd("email")} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Password
                  </Label>
                  <Input id="password" placeholder="********" className="col-span-3" {...registerAdd("password")} />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableCaption>A list of admins registered in the system.</TableCaption>
        <TableHeader className="bg-secondary text-secondary">
          <TableRow>
            <TableHead className="w-[100px]">User ID</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins?.map((admin: Admin) => (
            <TableRow key={admin.id} className="hover:bg-secondary">
              <TableCell className="font-medium">{admin.id.toString().slice(0, 6)}</TableCell>
              <TableCell>{admin.name}</TableCell>
              <TableCell>{admin.email}</TableCell>
              <TableCell className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" onClick={() => handleEditClick(admin)}>
                      <LucidePencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleEditSubmit(onSubmitEdit)}>
                      <DialogHeader>
                        <DialogTitle>Edit Admin</DialogTitle>
                        <DialogDescription>
                          Update admin information.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Full Name
                          </Label>
                          <Input id="name" className="col-span-3" {...registerEdit("name")} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="email" className="text-right">
                            Email
                          </Label>
                          <Input id="email" className="col-span-3" {...registerEdit("email")} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="password" className="text-right">
                            New Password
                          </Label>
                          <Input id="password" type="password" placeholder="Leave empty to keep current" className="col-span-3" {...registerEdit("password")} />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Save Changes</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the user from the system.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteUser.mutate(admin.id)}>{deleteUser.isPending ? "Deleting..." : "Delete"}</AlertDialogAction>
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