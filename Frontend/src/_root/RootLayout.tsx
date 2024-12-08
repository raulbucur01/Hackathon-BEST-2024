import { SidebarProvider } from "@/components/ui/sidebar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="w-full md:flex h-screen">
      {/* Sidebar */}
      <SidebarProvider>
        <LeftSidebar />


      {/* Main Content Section */}
      <section className="flex flex-1 h-full">
        <main className="w-full h-full overflow-y-auto">
          <Outlet />
        </main>
      </section>
      </SidebarProvider>
    </div>
  );
};

export default RootLayout;
