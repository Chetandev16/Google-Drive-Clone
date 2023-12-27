import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";

import { filter } from "lodash";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    const { fileId, isStared } = await req.json();

    if (!fileId || isStared == undefined)
      return new NextResponse("File id or isStared value is missing", {
        status: 500,
      });

    if (isStared) {
      await db.file.update({
        where: { id: fileId },
        data: {
          startedBy: { push: user.id },
        },
      });
    } else {
      const data = await db.file.findUnique({
        where: { id: fileId },
      });

      const filterdStaredBy = filter(data?.startedBy, (id) => user.id != id);

      await db.file.update({
        where: { id: fileId },
        data: {
          startedBy: [...filterdStaredBy],
        },
      });
    }

    return NextResponse.json({
      file_stared: isStared,
      file_id: fileId,
    });
  } catch (err) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
