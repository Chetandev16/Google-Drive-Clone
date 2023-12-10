import { initUser } from "@/lib/init-user";
import { redirect } from "next/navigation";

const Dashboard = async () => {
  const user = await initUser();
  console.log(user);

  redirect(`/dashboard/home`);
};

export default Dashboard;
