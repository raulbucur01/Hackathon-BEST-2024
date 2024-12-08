"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import { useEffect } from "react";

const NavUser = ({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) => {
  const { isMobile } = useSidebar();
  const navigate = useNavigate();
  const {
    mutate: signOut,
    isSuccess,
    isPending: isSigningOut,
  } = useSignOutAccount();

  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-dm-secondary data-[state=open]:text-dm-light text-dm-light bg-dm-dark p-2 rounded-md hover:bg-dm-secondary"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-dm-light">
                  {user.name}
                </span>
                <span className="truncate text-xs text-dm-accent">
                  {user.email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-dm-light" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-dm-dark-2"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal text-dm-light">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-dm-light">
                    {user.name}
                  </span>
                  <span className="truncate text-xs text-dm-accent">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-dm-accent" />
            <DropdownMenuGroup>
              <DropdownMenuItem className="text-dm-light hover:bg-dm-secondary">
                <Sparkles className="text-dm-light" />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-dm-accent" />
            <DropdownMenuGroup>
              <DropdownMenuItem className="text-dm-light hover:bg-dm-secondary">
                <BadgeCheck className="text-dm-light" />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem className="text-dm-light hover:bg-dm-secondary">
                <CreditCard className="text-dm-light" />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem className="text-dm-light hover:bg-dm-secondary">
                <Bell className="text-dm-light" />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-dm-accent" />
            <DropdownMenuItem
              onClick={() => signOut()}
              className="text-dm-light hover:bg-dm-secondary"
            >
              <LogOut className="text-dm-light" />
              {isSigningOut ? (
                <span>Signing out...</span>
              ) : (
                <span>Sign out</span>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default NavUser;
