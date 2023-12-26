import { initUser } from "@/lib/init-user";
import { redirect } from "next/navigation";

const Dashboard = async () => {
  await initUser();
  redirect(`/dashboard/home`);
};

export default Dashboard;
