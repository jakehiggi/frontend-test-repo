"use client"

import { useState, useEffect } from "react"
import type { FileItem } from "@/types/file-system"

const RECENT_FILES_KEY = "recent-files"
const MAX_RECENT_FILES = 10

export function useRecentFiles() {
  const [recentFiles, setRecentFiles] = useState<FileItem[]>([])

  useEffect(() => {
    const stored = localStorage.getItem(RECENT_FILES_KEY)
    if (stored) {
      try {
        setRecentFiles(JSON.parse(stored))
      } catch (error) {
        console.error("Failed to parse recent files:", error)
      }
    }
  }, [])

  const addRecentFile = (file: FileItem) => {
    if (file.type === "folder") return

    setRecentFiles((prev) => {
      const filtered = prev.filter((f) => f.id !== file.id)
      const updated = [file, ...filtered].slice(0, MAX_RECENT_FILES)
      localStorage.setItem(RECENT_FILES_KEY, JSON.stringify(updated))
      return updated
    })
  }

  const clearRecentFiles = () => {
    setRecentFiles([])
    localStorage.removeItem(RECENT_FILES_KEY)
  }

  return {
    recentFiles,
    addRecentFile,
    clearRecentFiles,
  }
}
