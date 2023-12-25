import { redirect } from "next/navigation";

const Dashboard = async () => {
  redirect(`/dashboard/home`);
};

export default Dashboard;
