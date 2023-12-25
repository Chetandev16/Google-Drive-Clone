import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { isEmpty, map } from "lodash";
import { NextResponse } from "next/server";

async function getParentFolders(folderId: string, parentFolders: any) {
  const folder = await db.folder.findUnique({
    where: { id: folderId },
  });

  if (!folder) {
    return null;
  }

  parentFolders.push({ name: folder.name, id: folder.id });

  if (!folder.parentId) return;

  await getParentFolders(folder.parentId, parentFolders);
}

export async function GET(req: Request) {
  try {
    const user = await currentUser();

    if (!user) return new NextResponse("Unauthorized", { status: 404 });

    const { searchParams } = new URL(req.url);

    const folderId = searchParams.get("folderId");

    if (!folderId) return new NextResponse("Invalid Params", { status: 401 });

    const parentFolders: any = [];
    await getParentFolders(folderId, parentFolders);

    const refiendData = !isEmpty(parentFolders)
      ? map(parentFolders, (folder) => {
          if (folder.id == user.id) return { name: "My Drive", id: null };
          return folder;
        }).reverse()
      : [];

    return NextResponse.json(refiendData);
  } catch (error) {
    console.log("[DELETE_FOLDER_FILE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
