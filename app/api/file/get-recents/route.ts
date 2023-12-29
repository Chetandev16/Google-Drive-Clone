import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { cloneDeep, map } from "lodash";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const user = await currentUser();

    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    const files = await db.file.findMany({
      where: {
        OR: [
          { userId: user.id },
          {
            sharedWith: {
              has: user.id,
            },
          },
        ],
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const userAccountInfo = {
      tier: user.tier,
      email: user.email,
      user_id: user.id,
      filesUploaded: parseInt(user.free_tier_files_uploaded),
      foldersCreated: parseInt(user.free_tier_folders_created),
      totalFilesLimit: parseInt(user.free_tier_limit_of_files),
      totalFoldersLimit: parseInt(user.free_tier_limit_of_folders),
    };

    const updatedFiles = map(files, (file) => {
      const startedBy = cloneDeep(file.startedBy);
      const {
        startedBy: deletedStartedBy,
        sharedWith: deletedSharedWith,
        ...updatedFile
      } = file;
      if (startedBy.includes(user.id)) {
        return {
          ...updatedFile,
          stared: true,
        };
      }

      return {
        ...updatedFile,
        stared: false,
      };
    });

    return NextResponse.json({
      files: updatedFiles,
      folders: [],
      userAccountInfo,
    });
  } catch (err) {
    console.log("RECENT_FILE_ERROR", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
