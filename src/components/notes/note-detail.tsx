"use client"

import * as React from "react"
import { useState } from "react"
import { 
  BookmarkPlus, 
  ChevronDown, 
  Download, 
  ExternalLink, 
  Heart, 
  MessageSquare, 
  MoreHorizontal, 
  Palette, 
  Pin, 
  Search, 
  Share2, 
  Trash2 
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

type NoteType = "default" | "important" | "info" | "warning" | "success"

interface Attachment {
  id: string
  name: string
  type: string
  url: string
  date: string
}

interface Note {
  id: string
  title: string
  content: string
  date: string
  type: NoteType
  tags?: string[]
  attachments?: Attachment[]
}

interface NoteDetailProps {
  note?: Note
  className?: string
}

// Sample data for demonstration
const sampleNote: Note = {
  id: "1",
  title: "Fusion energy",
  content: `<h1>Fusion energy</h1>
  <p>Generating endless energy with zero emissions by fusing hydrogen atoms together has been somewhat of a pipe dream for decades. Now, scientists are a tiny step closer to feasible fusion power, thanks to a futuristic experiment with plasma guns.</p>
  <p>Eighteen of 36 plasma guns are in place on the machine that could lead to a new approach to the problem. These guns are the key components of Los Alamos National Laboratory's Plasma Liner Experiment (PLX).</p>
  <p>The PLX aims to combine two existing methods of starting fusion reactions — magnetic confinement and inertial confinement — into a new approach known as magneto-inertial fusion.</p>`,
  date: "11/17/2023",
  type: "important",
  tags: ["energy", "science"],
  attachments: [
    {
      id: "a1",
      name: "Google drive",
      type: "folder",
      url: "https://drive.google.com",
      date: "11/17/2023"
    },
    {
      id: "a2",
      name: "Podcast draft.mp3",
      type: "audio",
      url: "#",
      date: "11/17/2023"
    }
  ]
}

export function NoteDetail({ note = sampleNote, className }: NoteDetailProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isPinned, setIsPinned] = useState(false)

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  const togglePin = () => {
    setIsPinned(!isPinned)
  }

  const getTypeColor = (type: NoteType) => {
    switch (type) {
      case "important":
        return "bg-red-500"
      case "info":
        return "bg-blue-500"
      case "warning":
        return "bg-yellow-500"
      case "success":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  if (!note) {
    return (
      <div className={cn("flex flex-col items-center justify-center h-full", className)}>
        <p className="text-muted-foreground">Select a note to view</p>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Note header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <div className={cn("h-2 w-2 rounded-full", getTypeColor(note.type))} />
          <h1 className="text-xl font-semibold">{note.title}</h1>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-8 w-8", isFavorite && "text-red-500")}
            onClick={toggleFavorite}
          >
            <Heart className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-8 w-8", isPinned && "text-blue-500")}
            onClick={togglePin}
          >
            <Pin className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <BookmarkPlus className="h-4 w-4 mr-2" />
                Add to favorites
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Pin className="h-4 w-4 mr-2" />
                Pin note
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Palette className="h-4 w-4 mr-2" />
                Set color
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Search className="h-4 w-4 mr-2" />
                Find in note
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Export
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Note content */}
      <div className="flex-1 overflow-auto p-6">
        <div dangerouslySetInnerHTML={{ __html: note.content }} />
      </div>

      {/* Attachments section */}
      {note.attachments && note.attachments.length > 0 && (
        <div className="border-t p-4">
          <h3 className="text-sm font-medium mb-2">Attachments</h3>
          <div className="space-y-2">
            {note.attachments.map((attachment) => (
              <div key={attachment.id} className="flex items-center p-2 rounded-md border">
                {attachment.type === "folder" ? (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="bg-blue-100 text-blue-700 p-1 rounded">
                      <ExternalLink className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{attachment.name}</p>
                      <p className="text-xs text-muted-foreground">{attachment.url}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{attachment.date}</p>
                  </div>
                ) : attachment.type === "audio" ? (
                  <div className="flex items-center gap-2 text-sm w-full">
                    <div className="bg-purple-100 text-purple-700 p-1 rounded">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{attachment.name}</p>
                      <div className="h-1 w-full bg-gray-200 rounded-full mt-1">
                        <div className="h-1 bg-purple-500 rounded-full w-1/3"></div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{attachment.date}</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="bg-gray-100 p-1 rounded">
                      <ExternalLink className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{attachment.name}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{attachment.date}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Editor toolbar */}
      <div className="border-t p-2 flex items-center">
        <div className="flex items-center gap-1 text-muted-foreground text-sm">
          <Button variant="ghost" size="sm" className="h-8 px-2">
            Type '/' or add
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}