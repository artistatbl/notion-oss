"use client"

import { type LucideIcon } from "lucide-react"

import { navMainData } from "@/components/sidebar/data/nav-main-data"
import { useNotes } from "@/components/notes/notes-context"
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
  const { toggleNotes, isNotesVisible } = useNotes()

  const handleItemClick = (e: React.MouseEvent, item: typeof items[0]) => {
    if (item.title === "Note") {
      e.preventDefault()
      toggleNotes()
    }
  }

  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton 
            asChild 
            isActive={item.title === "Note" ? isNotesVisible : item.isActive}
          >
            <a 
              href={item.url} 
              onClick={(e) => handleItemClick(e, item)}
            >
              <item.icon />
              <span>{item.title}</span>
              {item.badge && (
                <span className="ml-auto text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">
                  {item.badge}
                </span>
              )}
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
