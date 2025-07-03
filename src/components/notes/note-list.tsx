"use client"

import * as React from "react"
import { useState } from "react"
import { ChevronDown, Filter, MoreHorizontal, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type NoteType = "default" | "important" | "info" | "warning" | "success"

interface Note {
  id: string
  title: string
  preview: string
  date: string
  type: NoteType
  tags?: string[]
}

interface NoteListProps {
  notes: Note[]
  onNoteSelect?: (noteId: string) => void
  className?: string
}

// Sample data for demonstration
const sampleNotes: Note[] = [
  {
    id: "1",
    title: "Fusion energy",
    preview: "Generating endless energy with zero emissions by fusing hydrogen atoms together has been somewhat of a pipe dream for decades.",
    date: "11/17/2023",
    type: "important",
    tags: ["energy", "science"]
  },
  {
    id: "2",
    title: "New note",
    preview: "This is a new note with some content.",
    date: "11/17/2023",
    type: "default"
  },
  {
    id: "3",
    title: "Activation code",
    preview: "XYZ-1234-5678-ABCD",
    date: "11/17/2023",
    type: "info"
  },
  {
    id: "4",
    title: "Post-Workout Nutrition: What to Eat After",
    preview: "Proper post-workout nutrition is crucial for recovery and muscle growth.",
    date: "11/16/2023",
    type: "success",
    tags: ["health", "fitness"]
  },
  {
    id: "5",
    title: "Podcast draft",
    preview: "Ideas for the next podcast episode about technology trends.",
    date: "11/15/2023",
    type: "default",
    tags: ["podcast", "tech"]
  }
]

export function NoteList({ notes = sampleNotes, onNoteSelect, className }: NoteListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null)

  // Filter notes based on search query
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    note.preview.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleNoteClick = (noteId: string) => {
    if (onNoteSelect) {
      onNoteSelect(noteId)
    }
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

  return (
    <div className={cn("flex flex-col h-full border-r", className)}>
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-medium">All notes</h2>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Filter className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Filter notes</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Create new note</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <p className="text-muted-foreground">No notes found</p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="flex flex-col p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleNoteClick(note.id)}
              >
                <div className="flex items-center gap-2">
                  <div className={cn("h-2 w-2 rounded-full", getTypeColor(note.type))} />
                  <h3 className="font-medium flex-1 truncate">{note.title}</h3>
                  <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto" onClick={(e) => {
                    e.stopPropagation()
                    // Handle more options
                  }}>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-muted-foreground">{note.date}</p>
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Separator orientation="vertical" className="h-3" />
                      <div className="flex items-center gap-1">
                        {note.tags.map((tag) => (
                          <span key={tag} className="text-xs px-1.5 py-0.5 bg-muted rounded-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{note.preview}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}