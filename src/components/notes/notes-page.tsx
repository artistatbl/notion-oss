"use client"

import * as React from "react"
import { useState } from "react"

import { NoteList } from "@/components/notes/note-list"
import { NoteDetail } from "@/components/notes/note-detail"

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
  preview: string
  date: string
  type: NoteType
  tags?: string[]
  attachments?: Attachment[]
}

interface NotesPageProps {
  className?: string
}

// Sample data for demonstration
const sampleNotes: Note[] = [
  {
    id: "1",
    title: "Fusion energy",
    preview: "Generating endless energy with zero emissions by fusing hydrogen atoms together has been somewhat of a pipe dream for decades.",
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
  },
  {
    id: "2",
    title: "New note",
    preview: "This is a new note with some content.",
    content: "<h1>New note</h1><p>This is a new note with some content.</p>",
    date: "11/17/2023",
    type: "default"
  },
  {
    id: "3",
    title: "Activation code",
    preview: "XYZ-1234-5678-ABCD",
    content: "<h1>Activation code</h1><p>XYZ-1234-5678-ABCD</p>",
    date: "11/17/2023",
    type: "info"
  },
  {
    id: "4",
    title: "Post-Workout Nutrition: What to Eat After",
    preview: "Proper post-workout nutrition is crucial for recovery and muscle growth.",
    content: `<h1>Post-Workout Nutrition: What to Eat After</h1>
    <p>Proper post-workout nutrition is crucial for recovery and muscle growth. Here are some key points to consider:</p>
    <ul>
      <li>Consume protein within 30 minutes of your workout</li>
      <li>Include some carbohydrates to replenish glycogen stores</li>
      <li>Stay hydrated with water or an electrolyte drink</li>
      <li>Consider adding anti-inflammatory foods like berries or turmeric</li>
    </ul>`,
    date: "11/16/2023",
    type: "success",
    tags: ["health", "fitness"]
  },
  {
    id: "5",
    title: "Podcast draft",
    preview: "Ideas for the next podcast episode about technology trends.",
    content: "<h1>Podcast draft</h1><p>Ideas for the next podcast episode about technology trends.</p>",
    date: "11/15/2023",
    type: "default",
    tags: ["podcast", "tech"]
  }
]

export function NotesPage({ className }: NotesPageProps) {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>("1") // Default to first note
  
  const selectedNote = selectedNoteId 
    ? sampleNotes.find(note => note.id === selectedNoteId) 
    : undefined

  const handleNoteSelect = (noteId: string) => {
    setSelectedNoteId(noteId)
  }

  return (
    <div className="flex h-full">
      <div className="w-80 h-full">
        <NoteList notes={sampleNotes} onNoteSelect={handleNoteSelect} />
      </div>
      <div className="flex-1 h-full">
        <NoteDetail note={selectedNote} />
      </div>
    </div>
  )
}