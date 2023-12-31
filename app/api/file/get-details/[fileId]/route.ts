import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { fileId: string } }
) {
  try {
    const user = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const fileId = params.fileId;

    if (!fileId) return new NextResponse("fileId missing", { status: 404 });

    const file = await db.file.findUnique({
      where: { id: fileId },
    });

    const fileOwner = await db.user.findUnique({
      where: { id: file?.userId },
    });

    const response = {
      ...file,
      fileOwner: fileOwner?.name,
      fileOwnerImage: fileOwner?.imageUrl,
    };

    return NextResponse.json(response);
  } catch (err) {
    return new NextResponse("Internal Server Error");
  }
}
