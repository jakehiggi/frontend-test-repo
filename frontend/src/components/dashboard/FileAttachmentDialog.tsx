"use client"

import { useState } from "react"
import { FileText, Sparkles, X, Clock, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { FileBreadcrumbs } from "./file-system/FileBreadcrumbs"
import { FileListView } from "./file-system/FileListView"
import { useFiles } from "@/hooks/useFiles"
import type { FileItem, FileSizeLimits } from "@/types/file-system"

interface FileAttachmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAttachFiles: (files: FileItem[]) => void
  selectedFiles: FileItem[]
}

const ATTACHMENT_SIZE_LIMITS: FileSizeLimits = {
  maxFileSize: 25 * 1024 * 1024, // 25MB per file
  maxTotalSize: 100 * 1024 * 1024, // 100MB total
  maxFileCount: 5, // 5 files max
}

export function FileAttachmentDialog({ open, onOpenChange, onAttachFiles, selectedFiles }: FileAttachmentDialogProps) {
  const [activeTab, setActiveTab] = useState("recent")
  const [tempSelectedFiles, setTempSelectedFiles] = useState<FileItem[]>(selectedFiles)

  // Use the Files hook for both user and generated files
  const {
    currentFiles,
    currentPath,
    breadcrumbs,
    recentFiles,
    navigateToPath,
    store,
  } = useFiles()

  // Get generated files from store
  const generatedFiles = store.generatedFiles
  const userFiles = store.userFiles

  // Simple breadcrumbs for generated files (since they're all in root)
  const generatedBreadcrumbs = [{ id: "root", name: "Generated Documents", path: "/" }]

  const handleFileSelect = (file: FileItem) => {
    if (file.type === "folder") return

    setTempSelectedFiles((prev) => {
      const isSelected = prev.some((f) => f.id === file.id)
      if (isSelected) {
        return prev.filter((f) => f.id !== file.id)
      } else {
        // Check file count limit
        if (prev.length >= ATTACHMENT_SIZE_LIMITS.maxFileCount) {
          return prev
        }
        return [...prev, file]
      }
    })
  }

  const handleFileAccess = (file: FileItem) => {
    store.addToRecentFiles(file)
  }

  const handleAttach = () => {
    // Add all selected files to recent files
    tempSelectedFiles.forEach((file) => store.addToRecentFiles(file))
    onAttachFiles(tempSelectedFiles)
    onOpenChange(false)
  }

  const handleCancel = () => {
    setTempSelectedFiles(selectedFiles)
    onOpenChange(false)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getTotalSize = () => {
    return tempSelectedFiles.reduce((total, file) => total + (file.size || 0), 0)
  }

  const isOverLimit = () => {
    return (
      tempSelectedFiles.length > ATTACHMENT_SIZE_LIMITS.maxFileCount ||
      getTotalSize() > ATTACHMENT_SIZE_LIMITS.maxTotalSize
    )
  }

  // Get current files based on active tab
  const getCurrentTabFiles = () => {
    if (activeTab === "recent") return recentFiles
    if (activeTab === "user-documents") return currentFiles
    if (activeTab === "generated-documents") return generatedFiles
    return []
  }

  const getCurrentTabBreadcrumbs = () => {
    if (activeTab === "user-documents") return breadcrumbs
    if (activeTab === "generated-documents") return generatedBreadcrumbs
    return []
  }

  const handleNavigate = (path: string) => {
    if (activeTab === "user-documents") {
      navigateToPath(path)
    }
    // Generated documents don't have navigation since they're flat
  }

  const handleFolderClick = (folderId: string) => {
    if (activeTab === "user-documents") {
      const folder = store.getFileById(folderId)
      if (folder && folder.type === "folder") {
        navigateToPath(folder.path)
      }
    }
    // Generated documents don't have folders
  }

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl h-[600px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Attach Files</DialogTitle>
            <DialogDescription>
              Select files from your documents to provide context to the AI. You can select up to{" "}
              {ATTACHMENT_SIZE_LIMITS.maxFileCount} files (max {formatFileSize(ATTACHMENT_SIZE_LIMITS.maxTotalSize)}{" "}
              total).
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 min-h-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="recent" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Recent Files
                </TabsTrigger>
                <TabsTrigger value="user-documents" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  User Documents
                </TabsTrigger>
                <TabsTrigger value="generated-documents" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Generated Documents
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 min-h-0 border rounded-md">
                <TabsContent value="recent" className="h-full m-0">
                  <div className="flex flex-col h-full">
                    <div className="p-4 border-b bg-muted/30 flex justify-between items-center">
                      <h3 className="font-medium">Recently Used Files</h3>
                      {recentFiles.length > 0 && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => store.clearRecentFiles()}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Clear
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Clear recent files list</TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                    <FileListView
                      items={recentFiles}
                      onFolderClick={() => {}} // No folders in recent files
                      onCreateFolder={() => {}} // Disabled
                      onRenameItem={() => {}} // Disabled
                      onDeleteItem={() => {}} // Disabled
                      onSelectFile={handleFileSelect}
                      onFileAccess={handleFileAccess}
                      selectedFiles={tempSelectedFiles}
                      allowUpload={false}
                      selectionMode={true}
                      sizeLimits={ATTACHMENT_SIZE_LIMITS}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="user-documents" className="h-full m-0">
                  <div className="flex flex-col h-full">
                    <FileBreadcrumbs breadcrumbs={breadcrumbs} onNavigate={handleNavigate} />
                    <FileListView
                      items={currentFiles}
                      onFolderClick={handleFolderClick}
                      onCreateFolder={() => {}} // Disabled in selection mode
                      onRenameItem={() => {}} // Disabled in selection mode
                      onDeleteItem={() => {}} // Disabled in selection mode
                      onSelectFile={handleFileSelect}
                      onFileAccess={handleFileAccess}
                      selectedFiles={tempSelectedFiles}
                      allowUpload={false}
                      selectionMode={true}
                      sizeLimits={ATTACHMENT_SIZE_LIMITS}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="generated-documents" className="h-full m-0">
                  <div className="flex flex-col h-full">
                    <FileBreadcrumbs breadcrumbs={generatedBreadcrumbs} onNavigate={() => {}} />
                    <FileListView
                      items={generatedFiles}
                      onFolderClick={() => {}} // No folders in generated documents
                      onCreateFolder={() => {}} // Disabled in selection mode
                      onRenameItem={() => {}} // Disabled in selection mode
                      onDeleteItem={() => {}} // Disabled in selection mode
                      onSelectFile={handleFileSelect}
                      onFileAccess={handleFileAccess}
                      selectedFiles={tempSelectedFiles}
                      allowUpload={false}
                      selectionMode={true}
                      sizeLimits={ATTACHMENT_SIZE_LIMITS}
                    />
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Selected Files Preview */}
          {tempSelectedFiles.length > 0 && (
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium">
                  Selected files ({tempSelectedFiles.length}/{ATTACHMENT_SIZE_LIMITS.maxFileCount})
                </p>
                <p className="text-sm text-muted-foreground">
                  Total: {formatFileSize(getTotalSize())} / {formatFileSize(ATTACHMENT_SIZE_LIMITS.maxTotalSize)}
                </p>
              </div>
              {isOverLimit() && (
                <p className="text-sm text-destructive mb-2">Selection exceeds limits. Please remove some files.</p>
              )}
              <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
                {tempSelectedFiles.map((file) => (
                  <div key={file.id} className="flex items-center gap-2 bg-accent px-3 py-1 rounded-full text-sm">
                    <span className="truncate max-w-[200px]">{file.name}</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-4 w-4 hover:bg-destructive hover:text-destructive-foreground rounded-full"
                          onClick={() => handleFileSelect(file)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Remove file</TooltipContent>
                    </Tooltip>
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleAttach} disabled={tempSelectedFiles.length === 0 || isOverLimit()}>
              Attach{" "}
              {tempSelectedFiles.length > 0
                ? `${tempSelectedFiles.length} file${tempSelectedFiles.length > 1 ? "s" : ""}`
                : "Files"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}