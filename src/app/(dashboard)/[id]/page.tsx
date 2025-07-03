"use client"

import { NavActions } from "@/components/sidebar/nav-actions"
import { NotesPage } from "@/components/notes/notes-page"
import { NotesProvider, useNotes } from "@/components/notes/notes-context"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

function DashboardContent() {
  const { isNotesVisible } = useNotes()

  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-2">
        <div className="flex flex-1 items-center gap-2 px-3">
          <SidebarTrigger />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="line-clamp-1">
                  Dashboard
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto px-3">
          <NavActions />
        </div>
      </header>
      <div className="flex flex-1 h-[calc(100vh-3.5rem)]">
        {isNotesVisible ? (
          <NotesPage />
        ) : (
          <div className="flex flex-col items-center justify-center w-full">
            <h2 className="text-2xl font-semibold mb-4">Welcome to JStack</h2>
            <p className="text-muted-foreground">Click on the Note navigation item to view your notes.</p>
          </div>
        )}
      </div>
    </>
  )
}

export default function DashboardPage() {
  return (
    <DashboardContent />
  )
}