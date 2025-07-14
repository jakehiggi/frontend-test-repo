"use client"

import type React from "react"

import { useState } from "react"
import { Folder, File, Upload, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { FileContextMenu } from "./FileContextMenu"
import type { FileItem } from "@/types/file-system"

interface FileGridProps {
  items: FileItem[]
  onFolderClick: (folderId: string) => void
  onCreateFolder: (name: string) => void
  onUploadFile?: (file: File) => void
  onRenameItem: (id: string, newName: string) => void
  onDeleteItem: (id: string) => void
  allowUpload?: boolean
}

export function FileGrid({
  items,
  onFolderClick,
  onCreateFolder,
  onUploadFile,
  onRenameItem,
  onDeleteItem,
  allowUpload = true,
}: FileGridProps) {
  const [contextMenu, setContextMenu] = useState<{
    x: number
    y: number
    item: FileItem | null
  } | null>(null)
  const [renameDialog, setRenameDialog] = useState<FileItem | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<FileItem | null>(null)
  const [newFolderDialog, setNewFolderDialog] = useState(false)
  const [newName, setNewName] = useState("")
  const [dragOver, setDragOver] = useState(false)

  const handleContextMenu = (e: React.MouseEvent, item: FileItem | null) => {
    e.preventDefault()
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      item,
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    if (!allowUpload) return
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    if (!allowUpload || !onUploadFile) return
    e.preventDefault()
    setDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    files.forEach((file) => onUploadFile(file))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!allowUpload || !onUploadFile) return
    const files = Array.from(e.target.files || [])
    files.forEach((file) => onUploadFile(file))
    e.target.value = ""
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (item: FileItem) => {
    if (item.type === "folder") {
      return <Folder className="h-8 w-8 text-blue-500" />
    }
    return <File className="h-8 w-8 text-gray-500" />
  }

  return (
    <div className="flex-1 p-4">
      {/* Upload Area */}
      {allowUpload && (
        <div className="mb-4 flex gap-2">
          <Button size="sm" onClick={() => setNewFolderDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Folder
          </Button>
          <div className="relative">
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              id="file-upload"
            />
            <Button size="sm" asChild>
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                Upload Files
              </label>
            </Button>
          </div>
        </div>
      )}

      {/* File Grid */}
      <div
        className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 min-h-[200px] p-4 border-2 border-dashed rounded-lg transition-colors ${
          dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onContextMenu={(e) => handleContextMenu(e, null)}
      >
        {items.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Folder className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-lg font-medium">No files or folders</p>
            <p className="text-sm">
              {allowUpload
                ? "Upload files or create folders to get started"
                : "Create folders to organize your documents"}
            </p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
              onClick={() => item.type === "folder" && onFolderClick(item.id)}
              onContextMenu={(e) => handleContextMenu(e, item)}
            >
              {getFileIcon(item)}
              <span className="text-sm font-medium mt-2 text-center truncate w-full" title={item.name}>
                {item.name}
              </span>
              {item.type === "file" && item.size && (
                <span className="text-xs text-muted-foreground">{formatFileSize(item.size)}</span>
              )}
              <span className="text-xs text-muted-foreground">{item.lastModified.toLocaleDateString()}</span>
            </div>
          ))
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <FileContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          item={contextMenu.item}
          onClose={() => setContextMenu(null)}
          onRename={(item) => {
            setRenameDialog(item)
            setNewName(item.name)
          }}
          onDelete={(item) => setDeleteDialog(item)}
          onNewFolder={() => setNewFolderDialog(true)}
        />
      )}

      {/* Rename Dialog */}
      <Dialog open={!!renameDialog} onOpenChange={() => setRenameDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename {renameDialog?.type}</DialogTitle>
            <DialogDescription>Enter a new name for this {renameDialog?.type}.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={`${renameDialog?.type} name`}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newName.trim() && renameDialog) {
                  onRenameItem(renameDialog.id, newName.trim())
                  setRenameDialog(null)
                  setNewName("")
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameDialog(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (newName.trim() && renameDialog) {
                  onRenameItem(renameDialog.id, newName.trim())
                  setRenameDialog(null)
                  setNewName("")
                }
              }}
              disabled={!newName.trim()}
            >
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteDialog?.type}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteDialog?.name}"?
              {deleteDialog?.type === "folder" && " This will also delete all contents inside this folder."} This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteDialog) {
                  onDeleteItem(deleteDialog.id)
                  setDeleteDialog(null)
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* New Folder Dialog */}
      <Dialog open={newFolderDialog} onOpenChange={setNewFolderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>Enter a name for the new folder.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Folder name"
              onKeyDown={(e) => {
                if (e.key === "Enter" && newName.trim()) {
                  onCreateFolder(newName.trim())
                  setNewFolderDialog(false)
                  setNewName("")
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewFolderDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (newName.trim()) {
                  onCreateFolder(newName.trim())
                  setNewFolderDialog(false)
                  setNewName("")
                }
              }}
              disabled={!newName.trim()}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
