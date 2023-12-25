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
  })) || [
    {
      files: [],
      folders: [],
      userAccountInfo: { tier: "FREE", filesUploaded: 0, foldersCreated: 0 },
    },
  ];

  let userAccountInfo = {};

  if (user) {
    userAccountInfo = {
      tier: user.tier,
      filesUploaded: parseInt(user.free_tier_files_uploaded),
      foldersCreated: parseInt(user.free_tier_folders_created),
      totalFilesLimit: parseInt(user.free_tier_limit_of_files),
      totalFoldersLimit: parseInt(user.free_tier_limit_of_folders),
    };
  }
  return NextResponse.json({
    files: user.files,
    folders: user.folders,
    userAccountInfo,
  });
}
