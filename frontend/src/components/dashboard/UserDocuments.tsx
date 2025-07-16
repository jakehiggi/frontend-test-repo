"use client"

import { FileBreadcrumbs } from "./file-system/FileBreadcrumbs"
import { FileListView } from "./file-system/FileListView"
import { useFiles } from "@/hooks/useFiles"

export function UserDocuments() {
  const {
    currentFiles,
    currentPath,
    breadcrumbs,
    uploadFile,
    createFolder,
    navigateToPath,
    renameFile,
    deleteFile,
    store,
  } = useFiles()

  const handleCreateFolder = (name: string) => {
    createFolder(name, false)
  }

  const handleUploadFile = (file: File) => {
    uploadFile(file, false)
  }

  const handleRenameItem = (id: string, newName: string) => {
    renameFile(id, newName, false)
  }

  const handleDeleteItem = (id: string) => {
    deleteFile(id, false)
  }

  const handleRollbackFile = (fileId: string, versionId: string) => {
    const file = store.getFileById(fileId)
    if (file?.versions) {
      const version = file.versions.find(v => v.versionId === versionId)
      if (version) {
        store.updateFile(fileId, {
          content: version.content,
          size: version.size,
          lastModified: new Date(),
        }, false)
      }
    }
  }

  const handleCompressFile = (fileId: string) => {
    const file = store.getFileById(fileId)
    if (file && !file.isCompressed) {
      const compressedSize = Math.max(1, Math.floor((file.size || 0) * 0.5))
      store.updateFile(fileId, {
        size: compressedSize,
        content: `[COMPRESSED] ${file.content || ""}`,
        isCompressed: true,
      }, false)
    }
  }

  const navigateToFolder = (folderId: string) => {
    const folder = store.getFileById(folderId)
    if (folder && folder.type === "folder") {
      navigateToPath(folder.path)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <FileBreadcrumbs breadcrumbs={breadcrumbs} onNavigate={navigateToPath} />
      <FileListView
        items={currentFiles}
        onFolderClick={navigateToFolder}
        onCreateFolder={handleCreateFolder}
        onUploadFile={handleUploadFile}
        onRenameItem={handleRenameItem}
        onDeleteItem={handleDeleteItem}
        onRollbackFile={handleRollbackFile}
        onCompressFile={handleCompressFile}
        allowUpload={true}
      />
    </div>
  )
}