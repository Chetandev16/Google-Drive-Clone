import { UserButton } from "@clerk/nextjs";
import { initUser } from "@/app/lib/init-user";

const Home = async () => {
  const user = await initUser();
  console.log(user);
  return (
    <div>
      <UserButton afterSignOutUrl="/" />
    </div>
  );
};

export default Home;
