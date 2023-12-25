import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const user = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { folderId, folderName } = await req.json();

    if (!folderId)
      return new NextResponse("Folder id is required", { status: 401 });
    if (!folderName)
      return new NextResponse("Folder name is required", { status: 401 });

    const folder = await db.folder.update({
      where: { id: folderId, userId: user.id },
      data: {
        name: folderName,
      },
    });

    return NextResponse.json(folder);
  } catch (err) {
    console.log("[FOLDER_UPDATE]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
