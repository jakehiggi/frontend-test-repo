"use client"

import { useState } from "react"
import { History, Eye, UndoIcon as Rollback } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { FilePreview } from "./file-preview"
import type { FileItem, FileVersion } from "@/types/file-system"

interface FileVersionHistoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  file: FileItem | null
  onRollback: (fileId: string, versionId: string) => void
}

export function FileVersionHistoryDialog({ open, onOpenChange, file, onRollback }: FileVersionHistoryDialogProps) {
  const [previewVersion, setPreviewVersion] = useState<FileItem | null>(null)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handlePreviewVersion = (version: FileVersion) => {
    if (!file) return
    // Create a temporary FileItem for previewing the version
    setPreviewVersion({
      ...file,
      name: `${file.name} (Version ${version.lastModified.toLocaleString()})`,
      size: version.size,
      lastModified: version.lastModified,
      content: version.content,
      isCompressed: false, // Assume versions are uncompressed for preview
    })
  }

  const handleRollback = (versionId: string) => {
    if (file) {
      onRollback(file.id, versionId)
      onOpenChange(false) // Close dialog after rollback
    }
  }

  if (!file) return null

  const allVersions = [
    ...(file.versions || []),
    {
      versionId: "current",
      lastModified: file.lastModified,
      size: file.size,
      content: file.content,
    },
  ].sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()) // Sort by date descending

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl h-[500px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Version History for "{file.name}"
            </DialogTitle>
            <DialogDescription>View and manage previous versions of this file.</DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-auto border rounded-md">
            {allVersions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <History className="h-12 w-12 mb-4 opacity-50" />
                <p className="text-lg font-medium">No version history available</p>
                <p className="text-sm">Changes to this file will create new versions.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Version Date</TableHead>
                    <TableHead className="w-[100px]">Size</TableHead>
                    <TableHead>Content Preview</TableHead>
                    <TableHead className="w-[120px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allVersions.map((version) => (
                    <TableRow key={version.versionId}>
                      <TableCell className="font-medium">
                        {version.versionId === "current" ? (
                          <span className="font-bold text-primary">Current Version</span>
                        ) : (
                          version.lastModified.toLocaleString()
                        )}
                      </TableCell>
                      <TableCell>{version.size ? formatFileSize(version.size) : "—"}</TableCell>
                      <TableCell className="text-muted-foreground truncate max-w-[200px]">
                        {version.content || "No content preview"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handlePreviewVersion(version)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Preview this version</TooltipContent>
                          </Tooltip>
                          {version.versionId !== "current" && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 bg-transparent"
                                  onClick={() => handleRollback(version.versionId)}
                                >
                                  <Rollback className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Rollback to this version</TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <FilePreview file={previewVersion} onClose={() => setPreviewVersion(null)} />
    </TooltipProvider>
  )
}
