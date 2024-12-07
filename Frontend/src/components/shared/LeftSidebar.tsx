import {
  Home,
  User,
  Inbox,
  Search,
  Settings,
  LogOut,
  Loader,
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
      className="h-screen flex flex-col justify-between bg-gray-50"
      collapsible="none"
    >
      <SidebarContent>
        {/* Sidebar Menu */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-700 font-semibold text-sm uppercase">
            APP NAME
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className="flex items-center gap-3 p-2 text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      <item.icon size={18} className="text-gray-500" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userInfo} />
      </SidebarFooter>
    </Sidebar>
  );
};

export default LeftSidebar;
