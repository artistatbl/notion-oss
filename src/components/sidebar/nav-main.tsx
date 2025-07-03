"use client"

import { type LucideIcon } from "lucide-react"

import { navMainData } from "@/components/sidebar/data/nav-main-data"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items = navMainData,
}: {
  items?: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    badge?: string
  }[]
} = {}) {
  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild isActive={item.isActive}>
            <a href={item.url}>
              <item.icon />
              <span>{item.title}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
