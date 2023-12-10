import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";

export const currentUser = async () => {
  const { userId } = auth();

  if (!userId) return null;

  const profile = await db.user.findUnique({
    where: {
      userId,
    },
  });

  return profile;
};
