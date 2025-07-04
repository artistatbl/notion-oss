"use client";

import * as React from "react";

import { NavFavorites } from "@/components/sidebar/nav-favorites";
import { NavMain } from "@/components/sidebar/nav-main";
import { NavSecondary } from "@/components/sidebar/nav-secondary";
import { NavWorkspaces } from "@/components/sidebar/nav-workspaces";
import { TeamSwitcher } from "@/components/sidebar/team-switcher";
import { UserDropdown } from "@/components/sidebar/user-dropdown";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
  HoverSidebar,
  useSidebar,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();

  return (
    <>
      <div
        className={cn(
          "fixed top-4 left-4 z-50 flex items-center justify-center transition-all duration-300 ease-in-out",
          state === "expanded" 
            ? "opacity-0 scale-95 pointer-events-none" 
            : "opacity-100 scale-100 pointer-events-auto"
        )}
      >
        <SidebarTrigger className="transition-all duration-200 hover:scale-110" />
      </div>

      <Sidebar className="border-r-0" {...props}>
        <SidebarHeader>
          <div className="flex items-center justify-between px-2">
            <TeamSwitcher />
            <SidebarTrigger className="size-6 transition-all duration-200 hover:scale-110" />
          </div>
          <NavMain />
        </SidebarHeader>
        <SidebarContent>
          <NavFavorites />
          <NavWorkspaces />
          <NavSecondary className="mt-auto" />
        </SidebarContent>
        <SidebarFooter>
          <UserDropdown />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <HoverSidebar>
        <SidebarHeader>
          <div className="flex items-center justify-between px-2">
            <TeamSwitcher />
            <SidebarTrigger className="size-6 transition-all duration-200 hover:scale-110" />
          </div>
          <NavMain />
        </SidebarHeader>
        <SidebarContent>
          <NavFavorites />
          <NavWorkspaces />
          <NavSecondary className="mt-auto" />
        </SidebarContent>
        <SidebarFooter>
          <UserDropdown />
        </SidebarFooter>
      </HoverSidebar>
    </>
  );
}
