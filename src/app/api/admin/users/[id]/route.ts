//method to delete a user

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type Params = Promise<{ id: string }>
export async function DELETE(_request: NextRequest, { params }: { params: Params }) {
  const id = (await params).id;
  const user = await prisma.user.delete({
    where: { id: parseInt(id) },
  });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
}
