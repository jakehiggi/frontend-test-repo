"use client"

import {
  X,
  File,
  ImageIcon,
  FileText,
  Download,
  FileTypeIcon as FileTypePdf,
  FileTypeIcon as FileTypeDocx,
  FileSpreadsheetIcon as FileTypeXlsx,
  FileTypeIcon as FileTypePptx,
  FileArchive,
  FileCode,
  Music,
  Video,
  FileWarning,
  HardDriveDownload,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { FilePreviewProps } from "@/types/file-system"

export function FilePreview({ file, onClose }: FilePreviewProps) {
  if (!file) return null

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = () => {
    if (!file.mimeType && !file.name) return <File className="h-16 w-16 text-gray-500" />

    const mimeType = file.mimeType?.toLowerCase() || ""
    const fileName = file.name.toLowerCase()

    if (mimeType.startsWith("image/")) return <ImageIcon className="h-16 w-16 text-blue-500" />
    if (mimeType.startsWith("video/")) return <Video className="h-16 w-16 text-purple-500" />
    if (mimeType.startsWith("audio/")) return <Music className="h-16 w-16 text-green-500" />
    if (mimeType === "application/pdf") return <FileTypePdf className="h-16 w-16 text-red-500" />
    if (mimeType.includes("wordprocessingml") || fileName.endsWith(".doc") || fileName.endsWith(".docx"))
      return <FileTypeDocx className="h-16 w-16 text-blue-600" />
    if (mimeType.includes("spreadsheetml") || fileName.endsWith(".xls") || fileName.endsWith(".xlsx"))
      return <FileTypeXlsx className="h-16 w-16 text-green-600" />
    if (mimeType.includes("presentationml") || fileName.endsWith(".ppt") || fileName.endsWith(".pptx"))
      return <FileTypePptx className="h-16 w-16 text-orange-600" />
    if (mimeType.includes("zip") || fileName.endsWith(".zip") || fileName.endsWith(".rar") || fileName.endsWith(".7z"))
      return <FileArchive className="h-16 w-16 text-yellow-600" />
    if (
      mimeType.startsWith("text/") ||
      fileName.endsWith(".txt") ||
      fileName.endsWith(".md") ||
      fileName.endsWith(".csv")
    )
      return <FileText className="h-16 w-16 text-gray-500" />
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
      return <FileCode className="h-16 w-16 text-cyan-500" />

    return <File className="h-16 w-16 text-gray-500" />
  }

  const canPreviewContent = () => {
    if (!file.mimeType) return false
    return (
      file.mimeType.startsWith("image/") || file.mimeType.startsWith("text/") || file.mimeType === "application/pdf"
    )
  }

  return (
    <Dialog open={!!file} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="truncate">{file.name}</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Info */}
          <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
            {getFileIcon()}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{file.name}</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Size: {file.size ? formatFileSize(file.size) : "Unknown"}</p>
                <p>Type: {file.mimeType || "Unknown"}</p>
                <p>Modified: {file.lastModified.toLocaleString()}</p>
                {file.isCompressed && (
                  <p className="flex items-center gap-1 text-xs text-primary">
                    <HardDriveDownload className="h-3 w-3" />
                    Compressed
                  </p>
                )}
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>

          {/* Preview Content */}
          {canPreviewContent() && (
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-3">Preview</h4>
              {file.mimeType?.startsWith("image/") && (
                <div className="flex justify-center">
                  <img
                    src="/placeholder.svg?height=300&width=400"
                    alt={file.name}
                    className="max-w-full max-h-[300px] object-contain rounded"
                  />
                </div>
              )}
              {file.mimeType?.startsWith("text/") && (
                <div className="bg-muted p-3 rounded text-sm font-mono max-h-[300px] overflow-auto">
                  <p className="text-muted-foreground">{file.content || "No content available for preview."}</p>
                </div>
              )}
              {file.mimeType === "application/pdf" && (
                <div className="bg-muted p-8 rounded text-center">
                  <FileTypePdf className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">PDF preview would appear here...</p>
                </div>
              )}
            </div>
          )}
          {!canPreviewContent() && (
            <div className="border rounded-lg p-4 text-center text-muted-foreground">
              <FileWarning className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No preview available for this file type.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
