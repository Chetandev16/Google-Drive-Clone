import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { currentUser } from "@/lib/current-user";

export async function PATCH(req: Request) {
  try {
    const user = await currentUser();
    const { fileId } = await req.json();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!fileId) {
      return new NextResponse("File id missing", { status: 400 });
    }

    const file = await db.file.update({
      where: {
        id: fileId,
        userId: user.id,
      },
      data: {
        inviteCode: uuidv4(),
      },
    });

    return NextResponse.json({
      inviteCode: file.inviteCode,
      id: file.id,
    });
  } catch (err) {
    console.log("[SERVER_ID]", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
