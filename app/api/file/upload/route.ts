import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const { filePath, isFolderRoute, folderId } = await req.json();
    const user = await currentUser();
    const name = filePath?.split("/")[2];

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!isFolderRoute) {
      // Here i am createing a folder with name as same as user and folder id as user id to represent root folder path
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

    const file = await db.file.create({
      data: {
        userId: user.id,
        folderId: isFolderRoute ? folderId : user.id,
        name,
        uploadedURL: `${process.env.FILE_URL}${filePath}`,
        inviteCode: uuidv4(),
        sharedWithEmail: [],
        startedBy: [],
      },
    });

    return NextResponse.json(file);
  } catch (error) {
    console.log("[SERVERS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
