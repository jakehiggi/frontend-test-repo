"use client"

import type React from "react"
import { ImageIcon, FileText } from "lucide-react" // New imports for ImageIcon and FileText
import { useState } from "react"
import {
  Folder,
  File,
  Upload,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  History,
  FileTypeIcon as FileTypePdf,
  FileTypeIcon as FileTypeDocx,
  FileSpreadsheetIcon as FileTypeXlsx,
  FileTypeIcon as FileTypePptx,
  FileArchive,
  FileCode,
  Music,
  Video,
  HardDriveDownload,
} from "lucide-react"
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { FilePreview } from "./FilePreview"
import { FileVersionHistoryDialog } from "./FileVersionHistoryDialog"
import type { FileItem, FileSizeLimits } from "@/types/file-system"

interface FileListViewProps {
  items: FileItem[]
  onFolderClick: (folderId: string) => void
  onCreateFolder: (name: string) => void
  onUploadFile?: (file: File) => void
  onRenameItem: (id: string, newName: string) => void
  onDeleteItem: (id: string) => void
  onSelectFile?: (file: FileItem) => void
  onFileAccess?: (file: FileItem) => void
  onRollbackFile?: (fileId: string, versionId: string) => void
  onCompressFile?: (fileId: string) => void // New: for compressing files
  selectedFiles?: FileItem[]
  allowUpload?: boolean
  selectionMode?: boolean
  sizeLimits?: FileSizeLimits
}

const DEFAULT_SIZE_LIMITS: FileSizeLimits = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxTotalSize: 50 * 1024 * 1024, // 50MB
  maxFileCount: 10,
}

export function FileListView({
  items,
  onFolderClick,
  onCreateFolder,
  onUploadFile,
  onRenameItem,
  onDeleteItem,
  onSelectFile,
  onFileAccess,
  onRollbackFile,
  onCompressFile,
  selectedFiles = [],
  allowUpload = true,
  selectionMode = false,
  sizeLimits = DEFAULT_SIZE_LIMITS,
}: FileListViewProps) {
  const [renameDialog, setRenameDialog] = useState<FileItem | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<FileItem | null>(null)
  const [newFolderDialog, setNewFolderDialog] = useState(false)
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null)
  const [versionHistoryFile, setVersionHistoryFile] = useState<FileItem | null>(null)
  const [newName, setNewName] = useState("")
  const [dragOver, setDragOver] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

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
    validateAndUploadFiles(files)
  }

  const validateAndUploadFiles = (files: File[]) => {
    if (!onUploadFile) return

    // Check file count
    if (files.length > sizeLimits.maxFileCount) {
      setUploadError(`Cannot upload more than ${sizeLimits.maxFileCount} files at once`)
      return
    }

    // Check individual file sizes and total size
    let totalSize = 0
    for (const file of files) {
      if (file.size > sizeLimits.maxFileSize) {
        setUploadError(`File "${file.name}" is too large. Maximum size is ${formatFileSize(sizeLimits.maxFileSize)}`)
        return
      }
      totalSize += file.size
    }

    if (totalSize > sizeLimits.maxTotalSize) {
      setUploadError(`Total file size too large. Maximum is ${formatFileSize(sizeLimits.maxTotalSize)}`)
      return
    }

    // Upload files if validation passes
    setUploadError(null)
    files.forEach((file) => onUploadFile(file))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!allowUpload || !onUploadFile) return
    const files = Array.from(e.target.files || [])
    validateAndUploadFiles(files)
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
      return <Folder className="h-5 w-5 text-blue-500" />
    }

    const mimeType = item.mimeType?.toLowerCase() || ""
    const fileName = item.name.toLowerCase()

    if (mimeType.startsWith("image/")) return <ImageIcon className="h-5 w-5 text-blue-500" />
    if (mimeType.startsWith("video/")) return <Video className="h-5 w-5 text-purple-500" />
    if (mimeType.startsWith("audio/")) return <Music className="h-5 w-5 text-green-500" />
    if (mimeType === "application/pdf") return <FileTypePdf className="h-5 w-5 text-red-500" />
    if (mimeType.includes("wordprocessingml") || fileName.endsWith(".doc") || fileName.endsWith(".docx"))
      return <FileTypeDocx className="h-5 w-5 text-blue-600" />
    if (mimeType.includes("spreadsheetml") || fileName.endsWith(".xls") || fileName.endsWith(".xlsx"))
      return <FileTypeXlsx className="h-5 w-5 text-green-600" />
    if (mimeType.includes("presentationml") || fileName.endsWith(".ppt") || fileName.endsWith(".pptx"))
      return <FileTypePptx className="h-5 w-5 text-orange-600" />
    if (mimeType.includes("zip") || fileName.endsWith(".zip") || fileName.endsWith(".rar") || fileName.endsWith(".7z"))
      return <FileArchive className="h-5 w-5 text-yellow-600" />
    if (
      mimeType.startsWith("text/") ||
      fileName.endsWith(".txt") ||
      fileName.endsWith(".md") ||
      fileName.endsWith(".csv")
    )
      return <FileText className="h-5 w-5 text-gray-500" />
    if (
      mimeType.includes("javascript") ||
      mimeType.includes("json") ||
      fileName.endsWith(".js") ||
      fileName.endsWith(".ts") ||
      fileName.endsWith(".jsx") ||
      fileName.endsWith(".tsx") ||
      fileName.endsWith(".py") ||
      fileName.endsWith(".html") ||
      fileName.endsWith(".css") ||
      fileName.endsWith(".json") ||
      fileName.endsWith(".xml")
    )
      return <FileCode className="h-5 w-5 text-cyan-500" />

    return <File className="h-5 w-5 text-gray-500" />
  }

  const isSelected = (item: FileItem) => {
    return selectedFiles.some((f) => f.id === item.id)
  }

  const handleRowClick = (item: FileItem) => {
    if (selectionMode && onSelectFile) {
      onSelectFile(item)
      if (onFileAccess) {
        onFileAccess(item)
      }
    } else if (item.type === "folder") {
      onFolderClick(item.id)
    }
  }

  const handleDeleteConfirm = () => {
    if (deleteDialog) {
      onDeleteItem(deleteDialog.id)
      setDeleteDialog(null)
    }
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full">
        {/* Toolbar */}
        {allowUpload && (
          <div className="p-4 border-b bg-muted/30 flex gap-2 flex-wrap">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" onClick={() => setNewFolderDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Folder
                </Button>
              </TooltipTrigger>
              <TooltipContent>Create a new folder</TooltipContent>
            </Tooltip>
            <div className="relative">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="file-upload"
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" asChild>
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Files
                    </label>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Upload files from your device</TooltipContent>
              </Tooltip>
            </div>
            {sizeLimits && (
              <div className="text-xs text-muted-foreground flex items-center">
                Max: {formatFileSize(sizeLimits.maxFileSize)} per file, {sizeLimits.maxFileCount} files
              </div>
            )}
          </div>
        )}

        {/* Upload Error */}
        {uploadError && (
          <div className="mx-4 mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive">
            {uploadError}
            <Button variant="ghost" size="sm" className="ml-2 h-auto p-0" onClick={() => setUploadError(null)}>
              ×
            </Button>
          </div>
        )}

        {/* File List */}
        <div
          className={`flex-1 overflow-auto ${dragOver ? "bg-primary/5" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Folder className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">No files or folders</p>
              <p className="text-sm">
                {allowUpload
                  ? "Upload files or create folders to get started"
                  : "Create folders to organize your documents"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="w-[120px]">Size</TableHead>
                  <TableHead className="w-[150px]">Modified</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow
                    key={item.id}
                    className={`cursor-pointer hover:bg-accent/50 ${
                      isSelected(item) ? "bg-accent" : ""
                    } ${selectionMode ? "select-none" : ""}`}
                    onClick={() => handleRowClick(item)}
                  >
                    <TableCell className="w-[50px]">{getFileIcon(item)}</TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span className="truncate">{item.name}</span>
                        {item.isCompressed && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HardDriveDownload className="h-3 w-3 text-primary" />
                            </TooltipTrigger>
                            <TooltipContent>This file is compressed</TooltipContent>
                          </Tooltip>
                        )}
                        {isSelected(item) && <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.type === "file" && item.size ? formatFileSize(item.size) : "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{item.lastModified.toLocaleDateString()}</TableCell>
                    <TableCell className="w-[100px]">
                      <div className="flex gap-1">
                        {item.type === "file" && (
                          <>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setPreviewFile(item)
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Preview file</TooltipContent>
                            </Tooltip>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>More actions</TooltipContent>
                                </Tooltip>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setRenameDialog(item)
                                    setNewName(item.name)
                                  }}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Rename
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setDeleteDialog(item)
                                  }}
                                  className="text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setVersionHistoryFile(item)
                                  }}
                                >
                                  <History className="mr-2 h-4 w-4" />
                                  Version History
                                </DropdownMenuItem>
                                {!item.isCompressed && onCompressFile && (
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      onCompressFile(item.id)
                                    }}
                                  >
                                    <HardDriveDownload className="mr-2 h-4 w-4" />
                                    Compress File
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </>
                        )}
                        {item.type === "folder" && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>More actions</TooltipContent>
                              </Tooltip>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setRenameDialog(item)
                                  setNewName(item.name)
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Rename
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setDeleteDialog(item)
                                }}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* File Preview */}
        <FilePreview file={previewFile} onClose={() => setPreviewFile(null)} />

        {/* Version History Dialog */}
        <FileVersionHistoryDialog
          open={!!versionHistoryFile}
          onOpenChange={() => setVersionHistoryFile(null)}
          file={versionHistoryFile}
          onRollback={onRollbackFile || (() => {})} // Provide a no-op if not passed
        />

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
        <AlertDialog open={!!deleteDialog} onOpenChange={(open) => !open && setDeleteDialog(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete {deleteDialog?.type}</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{deleteDialog?.name}"?
                {deleteDialog?.type === "folder" && " This will also delete all contents inside this folder."} This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeleteDialog(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
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
    </TooltipProvider>
  )
}
