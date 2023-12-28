import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get("fileId");

    if (!fileId) return new NextResponse("FileId required", { status: 500 });

    const file = await db.file.findUnique({
      where: { id: fileId, userId: user.id },
    });

    if (!file) return new NextResponse("File not found", { status: 404 });

    const response = {
      ...file,
      fileOwner: user.name,
      fileOwnerImage: user.imageUrl,
    };

    return NextResponse.json(response);
  } catch (err) {
    console.log("DRAWER DETAIL ERROR", err);
    return new NextResponse("Internal Server Error", { status: 404 });
  }
}
