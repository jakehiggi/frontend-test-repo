"use client"

import { FileBreadcrumbs } from "./file-system/FileBreadcrumbs"
import { FileListView } from "./file-system/FileListView"
import { useFiles } from "@/hooks/useFiles"

export function GeneratedDocuments() {
  const { store } = useFiles()

  // Get generated files from the store
  const generatedFiles = store.generatedFiles
  
  // Simple breadcrumbs for generated documents (they're all in root)
  const breadcrumbs = [{ id: "root", name: "Generated Documents", path: "/" }]

  const handleCreateFolder = (name: string) => {
    // Create folder in generated documents
    const newFolder = {
      id: `gen_folder_${Date.now()}`,
      name,
      type: "folder" as const,
      lastModified: new Date(),
      parentId: null,
      path: `/${name}`,
    }
    store.addFile(newFolder, true) // true = generated file
  }

  const handleRenameItem = (id: string, newName: string) => {
    store.renameFile(id, newName, true) // true = generated file
  }

  const handleDeleteItem = (id: string) => {
    store.deleteFile(id, true) // true = generated file
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
        }, true) // true = generated file
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
      }, true) // true = generated file
    }
  }

  const navigateToFolder = (folderId: string) => {
    // For now, generated documents are flat, but this could be extended
    console.log('Navigate to folder:', folderId)
  }

  const navigateToPath = (path: string) => {
    // For now, generated documents are flat, but this could be extended
    console.log('Navigate to path:', path)
  }

  return (
    <div className="flex flex-col h-full">
      <FileBreadcrumbs breadcrumbs={breadcrumbs} onNavigate={navigateToPath} />
      <FileListView
        items={generatedFiles}
        onFolderClick={navigateToFolder}
        onCreateFolder={handleCreateFolder}
        onRenameItem={handleRenameItem}
        onDeleteItem={handleDeleteItem}
        onRollbackFile={handleRollbackFile}
        onCompressFile={handleCompressFile}
        allowUpload={false} // Generated documents are created by AI, not uploaded
      />
    </div>
  )
}