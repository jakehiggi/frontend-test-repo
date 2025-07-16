import { useFileStore } from '@/stores/fileStore'
import { useCallback } from 'react'
import type { FileItem } from '@/types/file-system'

export const useFiles = () => {
  const store = useFileStore()

  // Selectors
  const currentFiles = useFileStore((state) => state.getCurrentFiles())
  const currentPath = useFileStore((state) => state.currentPath)
  const breadcrumbs = useFileStore((state) => state.getBreadcrumbs())
  const recentFiles = useFileStore((state) => state.recentFiles)
  const selectedFiles = useFileStore((state) => state.selectedFiles)

  // Actions
  const uploadFile = useCallback((file: File, isGenerated = false) => {
    const newFile: FileItem = {
      id: `file_${Date.now()}`,
      name: file.name,
      type: 'file',
      size: file.size,
      lastModified: new Date(),
      parentId: null,
      path: `/${file.name}`,
      mimeType: file.type,
      content: `Content for ${file.name}`,
      versions: [],
    }
    store.addFile(newFile, isGenerated)
  }, [store])

  const createFolder = useCallback((name: string, isGenerated = false) => {
    const newFolder: FileItem = {
      id: `folder_${Date.now()}`,
      name,
      type: 'folder',
      lastModified: new Date(),
      parentId: null,
      path: `/${name}`,
    }
    store.addFile(newFolder, isGenerated)
  }, [store])

  const navigateToPath = useCallback((path: string) => {
    store.setCurrentPath(path)
  }, [store])

  const selectFile = useCallback((file: FileItem) => {
    store.toggleFileSelection(file)
  }, [store])

  const renameFile = useCallback((fileId: string, newName: string, isGenerated = false) => {
    store.renameFile(fileId, newName, isGenerated)
  }, [store])

  const deleteFile = useCallback((fileId: string, isGenerated = false) => {
    store.deleteFile(fileId, isGenerated)
  }, [store])

  return {
    // State
    currentFiles,
    currentPath,
    breadcrumbs,
    recentFiles,
    selectedFiles,
    
    // Actions
    uploadFile,
    createFolder,
    navigateToPath,
    selectFile,
    renameFile,
    deleteFile,
    
    // Raw store access
    store,
  }
}