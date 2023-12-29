import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { cloneDeep, map } from "lodash";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const user = await currentUser();

    if (!user) return new NextResponse("Unauthorized", { status: 401 });
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const files = await db.file.findMany({
      where: {
        sharedWith: {
          has: user.id,
        },
        name: {
          contains: search,
        },
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
    console.log("GET_SHARED_FILES", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
