"use client"

import { useState } from "react"
import type { FileItem, FileVersion } from "@/types/file-system"

export function useFileSystem(initialFiles: FileItem[] = []) {
  const [files, setFiles] = useState<FileItem[]>(initialFiles)
  const [currentPath, setCurrentPath] = useState("/")

  const generateFileContent = (name: string, timestamp: Date) => {
    return `This is the content for "${name}" created/updated on ${timestamp.toLocaleString()}.`
  }

  const createFolder = (name: string, parentId: string | null = null) => {
    const newFolder: FileItem = {
      id: `folder_${Date.now()}`,
      name,
      type: "folder",
      lastModified: new Date(),
      parentId,
      path: parentId ? `${getItemById(parentId)?.path}/${name}` : `/${name}`,
    }
    setFiles((prev) => [...prev, newFolder])
    return newFolder
  }

  const uploadFile = (file: File, parentId: string | null = null) => {
    const now = new Date()
    const newFileContent = generateFileContent(file.name, now)

    setFiles((prev) => {
      const existingFileIndex = prev.findIndex(
        (item) => item.type === "file" && item.name === file.name && item.parentId === parentId,
      )

      if (existingFileIndex !== -1) {
        // If file exists, create a new version
        const existingFile = prev[existingFileIndex]
        const newVersion: FileVersion = {
          versionId: `v_${existingFile.versions?.length || 0}_${existingFile.lastModified.getTime()}`,
          lastModified: existingFile.lastModified,
          size: existingFile.size,
          content: existingFile.content,
        }

        const updatedFile: FileItem = {
          ...existingFile,
          size: file.size,
          lastModified: now,
          mimeType: file.type,
          content: newFileContent,
          versions: [...(existingFile.versions || []), newVersion],
          isCompressed: false, // Reset compression status on new upload
        }
        const newFiles = [...prev]
        newFiles[existingFileIndex] = updatedFile
        return newFiles
      } else {
        // New file
        const newFile: FileItem = {
          id: `file_${Date.now()}`,
          name: file.name,
          type: "file",
          size: file.size,
          lastModified: now,
          parentId,
          path: parentId ? `${getItemById(parentId)?.path}/${file.name}` : `/${file.name}`,
          mimeType: file.type,
          content: newFileContent,
          versions: [],
          isCompressed: false,
        }
        return [...prev, newFile]
      }
    })
    return files.find((item) => item.name === file.name && item.parentId === parentId) // Return the updated/new file
  }

  const renameItem = (id: string, newName: string) => {
    setFiles((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const parentPath = item.parentId ? getItemById(item.parentId)?.path || "" : ""
          return {
            ...item,
            name: newName,
            path: `${parentPath}/${newName}`,
            lastModified: new Date(),
          }
        }
        return item
      }),
    )
  }

  const deleteItem = (id: string) => {
    const deleteRecursive = (itemId: string) => {
      const children = files.filter((f) => f.parentId === itemId)
      children.forEach((child) => deleteRecursive(child.id))
      setFiles((prev) => prev.filter((f) => f.id !== itemId))
    }
    deleteRecursive(id)
  }

  const updateFileContent = (fileId: string, newContent: string) => {
    setFiles((prev) =>
      prev.map((item) => {
        if (item.id === fileId && item.type === "file") {
          const now = new Date()
          const newVersion: FileVersion = {
            versionId: `v_${item.versions?.length || 0}_${item.lastModified.getTime()}`,
            lastModified: item.lastModified,
            size: item.content?.length || 0, // Simulate size based on content length
            content: item.content,
          }
          return {
            ...item,
            content: newContent,
            lastModified: now,
            size: newContent.length, // Simulate new size
            versions: [...(item.versions || []), newVersion],
            isCompressed: false, // Content change implies uncompressed
          }
        }
        return item
      }),
    )
  }

  const rollbackFile = (fileId: string, versionId: string) => {
    setFiles((prev) =>
      prev.map((item) => {
        if (item.id === fileId && item.type === "file") {
          const versionToRollback = item.versions?.find((v) => v.versionId === versionId)
          if (versionToRollback) {
            // Create a new version of the current state before rolling back
            const currentAsVersion: FileVersion = {
              versionId: `v_${item.versions?.length || 0}_${item.lastModified.getTime()}`,
              lastModified: item.lastModified,
              size: item.size,
              content: item.content,
            }

            // Filter out the versions newer than the rollback target
            const filteredVersions = item.versions?.filter(
              (v) => new Date(v.lastModified) < new Date(versionToRollback.lastModified),
            )

            return {
              ...item,
              content: versionToRollback.content,
              size: versionToRollback.size,
              lastModified: new Date(), // New modification date after rollback
              versions: [...(filteredVersions || []), currentAsVersion],
              isCompressed: false, // Rolled back version is uncompressed
            }
          }
        }
        return item
      }),
    )
  }

  const compressFile = (fileId: string) => {
    setFiles((prev) =>
      prev.map((item) => {
        if (item.id === fileId && item.type === "file" && !item.isCompressed) {
          const now = new Date()
          const newVersion: FileVersion = {
            versionId: `v_${item.versions?.length || 0}_${item.lastModified.getTime()}`,
            lastModified: item.lastModified,
            size: item.size,
            content: item.content,
          }
          // Simulate compression: reduce size, change content, mark as compressed
          const compressedSize = Math.max(1, Math.floor((item.size || 0) * 0.5)) // 50% reduction
          const compressedContent = `[COMPRESSED] ${item.content || ""}`

          return {
            ...item,
            size: compressedSize,
            content: compressedContent,
            lastModified: now,
            versions: [...(item.versions || []), newVersion],
            isCompressed: true,
          }
        }
        return item
      }),
    )
  }

  const getItemById = (id: string) => {
    return files.find((f) => f.id === id)
  }

  const getItemsByParent = (parentId: string | null) => {
    return files.filter((f) => f.parentId === parentId)
  }

  const getCurrentItems = () => {
    const currentFolderId = getCurrentFolderId()
    return getItemsByParent(currentFolderId)
  }

  const getCurrentFolderId = () => {
    if (currentPath === "/") return null
    const pathParts = currentPath.split("/").filter(Boolean)
    let currentId: string | null = null

    for (const part of pathParts) {
      const folder = files.find((f) => f.type === "folder" && f.name === part && f.parentId === currentId)
      if (folder) {
        currentId = folder.id
      }
    }
    return currentId
  }

  const navigateToPath = (path: string) => {
    setCurrentPath(path)
  }

  const navigateToFolder = (folderId: string) => {
    const folder = getItemById(folderId)
    if (folder && folder.type === "folder") {
      setCurrentPath(folder.path)
    }
  }

  const getBreadcrumbs = () => {
    if (currentPath === "/") {
      return [{ id: "root", name: "Root", path: "/" }]
    }

    const parts = currentPath.split("/").filter(Boolean)
    const breadcrumbs = [{ id: "root", name: "Root", path: "/" }]

    let currentId: string | null = null
    let currentPathBuilder = ""

    for (const part of parts) {
      currentPathBuilder += `/${part}`
      const folder = files.find((f) => f.type === "folder" && f.name === part && f.parentId === currentId)
      if (folder) {
        breadcrumbs.push({
          id: folder.id,
          name: folder.name,
          path: currentPathBuilder,
        })
        currentId = folder.id
      }
    }

    return breadcrumbs
  }

  return {
    files,
    currentPath,
    createFolder,
    uploadFile,
    renameItem,
    deleteItem,
    updateFileContent,
    rollbackFile,
    compressFile, // New: for compressing files
    getItemById,
    getCurrentItems,
    navigateToPath,
    navigateToFolder,
    getBreadcrumbs,
  }
}
