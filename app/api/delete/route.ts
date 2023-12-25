import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const user = await currentUser();

    if (!user) return new NextResponse("Unauthorized", { status: 404 });

    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");
    const deleteType = searchParams.get("deleteType");
    const id = searchParams.get("id");

    if (!deleteType || !name || !id)
      return new NextResponse("Invalid Params", { status: 401 });

    let del = null;

    if (deleteType == "Folder") {
      const folder = await db.folder.findUnique({
        where: { id },
        include: {
          files: true,
          folders: true,
        },
      });

      if (!folder) {
        return new NextResponse(`Folder with id: ${id} not found`, {
          status: 404,
        });
      }

      del = await db.folder.delete({
        where: { id, userId: user.id },
      });

      await db.user.update({
        where: { id: user.id },
        data: {
          free_tier_folders_created: (
            parseInt(user.free_tier_folders_created) - 1
          ).toString(),
        },
      });
    } else {
      const file = await db.file.findUnique({
        where: { id },
      });

      if (!file) {
        return new NextResponse(`File with id: ${id} not found`, {
          status: 404,
        });
      }

      del = await db.file.delete({
        where: { id, userId: user.id },
      });

      await db.user.update({
        where: { id: user.id },
        data: {
          free_tier_files_uploaded: (
            parseInt(user.free_tier_files_uploaded) - 1
          ).toString(),
        },
      });
    }

    return NextResponse.json(del);
  } catch (error) {
    console.log("[DELETE_FOLDER_FILE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
