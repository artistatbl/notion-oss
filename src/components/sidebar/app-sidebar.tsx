"use client"

import * as React from "react"

import { NavFavorites } from "@/components/sidebar/nav-favorites"
import { NavMain } from "@/components/sidebar/nav-main"
import { NavSecondary } from "@/components/sidebar/nav-secondary"
import { NavWorkspaces } from "@/components/sidebar/nav-workspaces"
import { TeamSwitcher } from "@/components/sidebar/team-switcher"
import { UserDropdown } from "@/components/sidebar/user-dropdown"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  HoverSidebar,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <>
      <Sidebar className="border-r-0" {...props}>
        <SidebarHeader>
          <TeamSwitcher />
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
          <TeamSwitcher />
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
  )
}
