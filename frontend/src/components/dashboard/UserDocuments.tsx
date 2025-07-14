"use client"

import { useFileSystem } from "@/hooks/useFileSystem"
import { FileBreadcrumbs } from "./file-system/FileBreadcrumbs"
import { FileListView } from "./file-system/FileListView"

export function UserDocuments() {
  const {
    currentPath,
    createFolder,
    uploadFile,
    renameItem,
    deleteItem,
    rollbackFile,
    compressFile, // New: for compressing files
    getCurrentItems,
    navigateToPath,
    navigateToFolder,
    getBreadcrumbs,
  } = useFileSystem()

  const currentItems = getCurrentItems()
  const breadcrumbs = getBreadcrumbs()

  const handleCreateFolder = (name: string) => {
    const currentFolderId =
      currentPath === "/" ? null : getCurrentItems().find((item) => item.type === "folder")?.parentId || null
    createFolder(name, currentFolderId)
  }

  const handleUploadFile = (file: File) => {
    const currentFolderId =
      currentPath === "/" ? null : getCurrentItems().find((item) => item.type === "folder")?.parentId || null
    uploadFile(file, currentFolderId)
  }

  return (
    <div className="flex flex-col h-full">
      <FileBreadcrumbs breadcrumbs={breadcrumbs} onNavigate={navigateToPath} />
      <FileListView
        items={currentItems}
        onFolderClick={navigateToFolder}
        onCreateFolder={handleCreateFolder}
        onUploadFile={handleUploadFile}
        onRenameItem={renameItem}
        onDeleteItem={deleteItem}
        onRollbackFile={rollbackFile}
        onCompressFile={compressFile} // Pass compress function
        allowUpload={true}
      />
    </div>
  )
}
