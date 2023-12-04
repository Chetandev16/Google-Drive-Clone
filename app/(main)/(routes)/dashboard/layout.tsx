import Navbar from "@/components/DashboardLayout/Navbar";
import Sidebar from "@/components/DashboardLayout/Sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen overflow-hidden">
      {/* navbar */}
      <Navbar />

      <div className="w-full h-full">
        <div className="flex w-full h-full">
          <Sidebar />
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
