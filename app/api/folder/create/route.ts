import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { parentId, folderName } = await req.json();

    if (!folderName) {
      return new NextResponse("Folder name is missing", {
        status: 401,
      });
    }

    if (!parentId) {
      const rootFolderExist = await db.folder.findUnique({
        where: {
          id: user.id,
        },
      });

      if (!rootFolderExist) {
        await db.folder.create({
          data: {
            id: user.id,
            name: `${user.name}`,
            userId: user.id,
          },
        });
      }
    }

    const folder = await db.folder.create({
      data: {
        name: folderName,
        userId: user.id,
        parentId: parentId || user.id,
      },
    });

    return NextResponse.json(folder);
  } catch (err) {
    console.log("[FOLDER_CREATE]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
