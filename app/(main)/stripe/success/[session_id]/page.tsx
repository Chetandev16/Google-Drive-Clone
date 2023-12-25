"use client";

import axios from "axios";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Props {
  params: {
    session_id: string;
  };
}

const StripeSuccess: React.FC<Props> = ({ params }) => {
  const { session_id } = params;
  const router = useRouter();

  useEffect(() => {
    if (!session_id) return;

    const upgradeUser = async () => {
      try {
        await axios.put("/api/users/upgrade", { session_id });
        toast.success("Upgraded to premium cloud plan!");
      } catch (err) {
        toast.error("Invalid session ID!");
      } finally {
        router.push("/dashboard/home");
      }
    };

    upgradeUser();
  }, [router, session_id]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p>Your payment is in progress. Please do not close this window.</p>
    </div>
  );
};

export default StripeSuccess;
