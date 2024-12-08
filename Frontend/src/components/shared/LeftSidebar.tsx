import {
  Home,
  User,
  Inbox,
  Search,
  Settings,
  LogOut,
  Loader,
  Calendar,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavUser from "./NavUser";

// Sidebar menu items
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
  {
    title: "Appointments",
    url: "/appointments",
    icon: Calendar,
  },
  {
    title: "Inbox",
    url: "/inbox",
    icon: Inbox,
  },
  {
    title: "Search",
    url: "/search",
    icon: Search,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

const LeftSidebar = () => {
  const { user } = useUserContext();

  const userInfo = {
    name: user.name,
    email: user.email,
    avatar: user.imageUrl,
  };

  return (
    <Sidebar
      className="h-screen flex flex-col justify-between bg-dm-dark-2 text-dm-light"
      collapsible="none"
    >
      <SidebarContent>
        {/* Sidebar Menu */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-dm-accent font-semibold text-sm uppercase">
            APP NAME
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className="flex items-center gap-3 p-2 text-dm-light hover:bg-dm-secondary hover:text-dm-light rounded-md transition-colors"
                    >
                      <item.icon size={18} className="text-dm-light" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-dm-dark-2 p-4">
        <NavUser user={userInfo} />
      </SidebarFooter>
    </Sidebar>
  );
};

export default LeftSidebar;
