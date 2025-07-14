export interface FileVersion {
  versionId: string
  lastModified: Date
  size?: number
  content?: string // Simulated content for the version
}

export interface FileItem {
  id: string
  name: string
  type: "file" | "folder"
  size?: number
  lastModified: Date
  parentId: string | null
  path: string
  mimeType?: string
  content?: string // Current content of the file
  versions?: FileVersion[] // History of previous versions
  isCompressed?: boolean // New: to indicate if the file is compressed
}

export interface BreadcrumbItem {
  id: string
  name: string
  path: string
}

export interface FileSystemContextMenuProps {
  x: number
  y: number
  item: FileItem | null
  onClose: () => void
  onRename: (item: FileItem) => void
  onDelete: (item: FileItem) => void
  onNewFolder: () => void
}

export interface FilePreviewProps {
  file: FileItem | null
  onClose: () => void
}

export interface FileSizeLimits {
  maxFileSize: number // in bytes
  maxTotalSize: number // in bytes
  maxFileCount: number
}
