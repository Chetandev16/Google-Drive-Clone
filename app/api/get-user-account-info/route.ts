import { currentUser } from "@/lib/current-user";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const user = await currentUser();

    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    const userAccountInfo = {
      tier: user.tier,
      user_id: user.id,
      email: user.email,
      filesUploaded: parseInt(user.free_tier_files_uploaded),
      foldersCreated: parseInt(user.free_tier_folders_created),
      totalFilesLimit: parseInt(user.free_tier_limit_of_files),
      totalFoldersLimit: parseInt(user.free_tier_limit_of_folders),
    };

    return NextResponse.json({
      userAccountInfo,
    });
  } catch (err) {
    console.log(err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
