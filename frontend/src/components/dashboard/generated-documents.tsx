"use client"

import { useFileSystem } from "@/hooks/useFileSystem"
import { FileBreadcrumbs } from "./file-system/file-breadcrumbs"
import { FileListView } from "./file-system/file-list-view"

// Mock generated documents
const mockGeneratedFiles = [
  {
    id: "gen_1",
    name: "Project Summary.pdf",
    type: "file" as const,
    size: 245760,
    lastModified: new Date("2024-01-15T10:30:00"),
    parentId: null,
    path: "/Project Summary.pdf",
    mimeType: "application/pdf",
    content: "This is the content of the generated project summary.",
    versions: [
      {
        versionId: "gen_1_v1",
        lastModified: new Date("2024-01-14T09:00:00"),
        size: 200000,
        content: "Initial draft of the project summary.",
      },
    ],
  },
  {
    id: "gen_2",
    name: "Meeting Notes.docx",
    type: "file" as const,
    size: 89120,
    lastModified: new Date("2024-01-14T14:20:00"),
    parentId: null,
    path: "/Meeting Notes.docx",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    content: "Detailed notes from the team meeting.",
    versions: [],
  },
]

export function GeneratedDocuments() {
  const {
    currentPath,
    createFolder,
    renameItem,
    deleteItem,
    rollbackFile,
    compressFile, // New: for compressing files
    getCurrentItems,
    navigateToPath,
    navigateToFolder,
    getBreadcrumbs,
  } = useFileSystem(mockGeneratedFiles)

  const currentItems = getCurrentItems()
  const breadcrumbs = getBreadcrumbs()

  const handleCreateFolder = (name: string) => {
    const currentFolderId =
      currentPath === "/" ? null : getCurrentItems().find((item) => item.type === "folder")?.parentId || null
    createFolder(name, currentFolderId)
  }

  return (
    <div className="flex flex-col h-full">
      <FileBreadcrumbs breadcrumbs={breadcrumbs} onNavigate={navigateToPath} />
      <FileListView
        items={currentItems}
        onFolderClick={navigateToFolder}
        onCreateFolder={handleCreateFolder}
        onRenameItem={renameItem}
        onDeleteItem={deleteItem}
        onRollbackFile={rollbackFile}
        onCompressFile={compressFile} // Pass compress function
        allowUpload={false}
      />
    </div>
  )
}
