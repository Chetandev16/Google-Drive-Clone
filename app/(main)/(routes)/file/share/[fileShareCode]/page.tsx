import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface Props {
  params: {
    fileShareCode: string;
  };
}

const ShareFile: React.FC<Props> = async ({ params }) => {
  const profile = await currentUser();
  const { fileShareCode } = params;
  if (!profile) return redirectToSignIn();

  if (!params.fileShareCode) {
    return redirect("/dashboard/shared");
  }

  const fileExist = await db.file.findFirst({
    where: {
      inviteCode: fileShareCode,
    },
  });

  const isUserExist = fileExist?.sharedWithEmail?.includes(profile.email);
  const isFileOwner = fileExist?.userId == profile.id;

  if (isUserExist || !fileExist || isFileOwner) {
    return redirect("/dashboard/shared");
  }

  const file = await db.file.update({
    where: {
      id: fileExist.id,
    },
    data: {
      sharedWithEmail: { push: profile.email },
    },
  });

  if (file) {
    return redirect("/dashboard/shared");
  }

  return null;
};

export default ShareFile;
