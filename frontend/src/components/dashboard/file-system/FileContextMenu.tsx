"use client"

import { useEffect } from "react"
import { Edit, Trash2, FolderPlus } from "lucide-react"
import type { FileSystemContextMenuProps } from "@/types/file-system"

export function FileContextMenu({ x, y, item, onClose, onRename, onDelete, onNewFolder }: FileSystemContextMenuProps) {
  useEffect(() => {
    const handleClickOutside = () => onClose()
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    document.addEventListener("click", handleClickOutside)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("click", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [onClose])

  return (
    <div
      className="fixed z-50 bg-background border rounded-md shadow-lg py-1 min-w-[160px]"
      style={{ left: x, top: y }}
      onClick={(e) => e.stopPropagation()}
    >
      {item && (
        <>
          <button
            className="w-full px-3 py-2 text-left text-sm hover:bg-accent flex items-center gap-2"
            onClick={() => {
              onRename(item)
              onClose()
            }}
          >
            <Edit className="h-4 w-4" />
            Rename
          </button>
          <button
            className="w-full px-3 py-2 text-left text-sm hover:bg-accent text-destructive flex items-center gap-2"
            onClick={() => {
              onDelete(item)
              onClose()
            }}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
          <hr className="my-1" />
        </>
      )}
      <button
        className="w-full px-3 py-2 text-left text-sm hover:bg-accent flex items-center gap-2"
        onClick={() => {
          onNewFolder()
          onClose()
        }}
      >
        <FolderPlus className="h-4 w-4" />
        New Folder
      </button>
    </div>
  )
}
