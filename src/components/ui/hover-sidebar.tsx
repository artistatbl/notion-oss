"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useSidebar } from "./sidebar"

const SIDEBAR_HEIGHT_HOVER = "80vh"

interface HoverSidebarProps {
  children: React.ReactNode
  side?: "left" | "right"
  variant?: "sidebar" | "floating" | "inset"
  className?: string
}

export function HoverSidebar({
  children,
  side = "left",
  variant = "sidebar",
  className,
  ...props
}: HoverSidebarProps & React.ComponentProps<"div">) {
  const { state } = useSidebar()
  const [, setIsHovered] = React.useState(false)
  const [showHoverSidebar, setShowHoverSidebar] = React.useState(false)
  const [isExiting, setIsExiting] = React.useState(false)
  const [hasOpenDropdown, setHasOpenDropdown] = React.useState(false)
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const exitTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const sidebarRef = React.useRef<HTMLDivElement>(null)

  const handleMouseEnter = React.useCallback(() => {
    if (state === "collapsed") {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (exitTimeoutRef.current) {
        clearTimeout(exitTimeoutRef.current)
      }
      setIsExiting(false)
      setIsHovered(true)
      setShowHoverSidebar(true)
    }
  }, [state])

  const handleMouseLeave = React.useCallback(() => {
    if (state === "collapsed" && !hasOpenDropdown) {
      setIsHovered(false)
      // Start exit animation
      setIsExiting(true)
      // Add a small delay before hiding to prevent flickering
      exitTimeoutRef.current = setTimeout(() => {
        setShowHoverSidebar(false)
        setIsExiting(false)
      }, 300) // Match the animation duration
    }
  }, [state, hasOpenDropdown])

  // Effect to detect dropdown state changes
  React.useEffect(() => {
    const checkDropdownState = () => {
      if (sidebarRef.current) {
        // Check for open dropdown menus within the sidebar
        const openDropdowns = sidebarRef.current.querySelectorAll('[data-state="open"]')
        setHasOpenDropdown(openDropdowns.length > 0)
      }
    }

    // Use MutationObserver to watch for dropdown state changes
    const observer = new MutationObserver(checkDropdownState)
    
    if (sidebarRef.current) {
      observer.observe(sidebarRef.current, {
        attributes: true,
        attributeFilter: ['data-state'],
        subtree: true
      })
    }

    // Also check for global dropdown state changes (for portaled content)
    const globalObserver = new MutationObserver(() => {
      const globalDropdowns = document.querySelectorAll('[data-slot="dropdown-menu-content"][data-state="open"]')
      setHasOpenDropdown(globalDropdowns.length > 0)
    })

    globalObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-state'],
      subtree: true
    })

    return () => {
      observer.disconnect()
      globalObserver.disconnect()
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (exitTimeoutRef.current) {
        clearTimeout(exitTimeoutRef.current)
      }
    }
  }, [])

  // Don't render if sidebar is not collapsed
  if (state !== "collapsed") {
    return null
  }

  return (
    <>
      {/* Hover trigger area */}
      <div
        className={cn(
          "fixed inset-y-0 z-[15] w-6 transition-all duration-300 ease-in-out",
          side === "left" ? "left-0" : "right-0"
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      
      {/* Hover sidebar */}
      {showHoverSidebar && (
        <div
          ref={sidebarRef}
          style={{
            "--sidebar-height-hover": SIDEBAR_HEIGHT_HOVER,
            height: "var(--sidebar-height-hover)",
            top: "calc((100vh - var(--sidebar-height-hover)) / 2)"
          } as React.CSSProperties}
          className={cn(
            "fixed z-50 w-64 transition-all duration-300 ease-in-out transform",
            side === "left" ? "left-0" : "right-0",
            "shadow-xl",
            !isExiting ? (
              side === "left" 
                ? "animate-in slide-in-from-left-4 fade-in-0 scale-100 opacity-100" 
                : "animate-in slide-in-from-right-4 fade-in-0 scale-100 opacity-100"
            ) : (
              side === "left"
                ? "animate-out slide-out-to-left-4 fade-out-0 scale-95 opacity-0"
                : "animate-out slide-out-to-right-4 fade-out-0 scale-95 opacity-0"
            ),
            className
          )}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          {...props}
        >
          <div
            className={cn(
              "bg-sidebar/95 backdrop-blur-sm border border-sidebar-border rounded-lg shadow-xl flex h-full w-full flex-col transition-all duration-300 ease-in-out transform",
              variant === "floating" && "border-sidebar-border rounded-lg border shadow-sm",
              !isExiting ? "scale-100" : "scale-95"
            )}
          >
            {children}
          </div>
        </div>
      )}
    </>
  )
}