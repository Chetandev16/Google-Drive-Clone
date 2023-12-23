import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { folderId: string } }
) {
  const currUser = await currentUser();

  if (!currUser) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const folderId = params.folderId == "root" ? currUser.id : params.folderId;

  if (!folderId) {
    return new NextResponse("Folder id is required", { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { id: currUser.id },
    include: {
      files: {
        where: { folderId },
      },
      folders: {
        where: { parentId: folderId, userId: currUser.id },
        include: {
          files: true,
          folders: true,
        },
      },
    },
  });

  return NextResponse.json(user);
}
