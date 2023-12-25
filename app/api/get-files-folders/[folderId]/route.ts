import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { map } from "lodash";
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

  const user: any = (await db.user.findUnique({
    where: { id: currUser.id },
    include: {
      files: {
        where: { folderId },
        orderBy: {
          createdAt: "asc",
        },
      },
      folders: {
        where: { parentId: folderId, userId: currUser.id },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  })) || [{ files: [], folders: [] }];

  return NextResponse.json({ files: user.files, folders: user.folders });
}
