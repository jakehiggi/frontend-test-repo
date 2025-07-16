// frontend/src/hooks/useFiles.ts
import { useFileStore, fileStoreSelectors } from '@/stores/fileStore'
import { useCallback, useMemo } from 'react'
import type { FileItem } from '@/types/file-system'

export const useFiles = () => {
  // Use stable selectors with default values
  const userFiles = useFileStore((state) => state.userFiles || [])
  const generatedFiles = useFileStore((state) => state.generatedFiles || [])
  const currentPath = useFileStore((state) => state.currentPath || "/")
  const recentFiles = useFileStore((state) => state.recentFiles || [])
  const selectedFiles = useFileStore((state) => state.selectedFiles || [])
  const uploadError = useFileStore((state) => state.uploadError)

  // Get store actions
  const setUserFiles = useFileStore((state) => state.setUserFiles)
  const setGeneratedFiles = useFileStore((state) => state.setGeneratedFiles)
  const addFile = useFileStore((state) => state.addFile)
  const updateFile = useFileStore((state) => state.updateFile)
  const deleteFile = useFileStore((state) => state.deleteFile)
  const renameFile = useFileStore((state) => state.renameFile)
  const setCurrentPath = useFileStore((state) => state.setCurrentPath)
  const addToRecentFiles = useFileStore((state) => state.addToRecentFiles)
  const clearRecentFiles = useFileStore((state) => state.clearRecentFiles)
  const setSelectedFiles = useFileStore((state) => state.setSelectedFiles)
  const toggleFileSelection = useFileStore((state) => state.toggleFileSelection)
  const setUploadError = useFileStore((state) => state.setUploadError)

  // Use memoized selectors to prevent infinite loops
  const currentFiles = useMemo(() => {
    // Add safety checks before calling selectors
    if (!Array.isArray(userFiles) || !Array.isArray(generatedFiles)) {
      return []
    }
    return fileStoreSelectors.getCurrentFiles(userFiles, generatedFiles, currentPath)
  }, [userFiles, generatedFiles, currentPath])

  const breadcrumbs = useMemo(() => {
    // Add safety checks before calling selectors
    if (!Array.isArray(userFiles) || !Array.isArray(generatedFiles)) {
      return [{ id: "root", name: "Root", path: "/" }]
    }
    return fileStoreSelectors.getBreadcrumbs(userFiles, generatedFiles, currentPath)
  }, [userFiles, generatedFiles, currentPath])

  // Memoized helper function
  const getFileById = useCallback((fileId: string) => {
    if (!Array.isArray(userFiles) || !Array.isArray(generatedFiles)) {
      return undefined
    }
    return fileStoreSelectors.getFileById(userFiles, generatedFiles, fileId)
  }, [userFiles, generatedFiles])

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
    addFile(newFile, isGenerated)
  }, [addFile])

  const createFolder = useCallback((name: string, isGenerated = false) => {
    const newFolder: FileItem = {
      id: `folder_${Date.now()}`,
      name,
      type: 'folder',
      lastModified: new Date(),
      parentId: null,
      path: `/${name}`,
    }
    addFile(newFolder, isGenerated)
  }, [addFile])

  const navigateToPath = useCallback((path: string) => {
    setCurrentPath(path)
  }, [setCurrentPath])

  const selectFile = useCallback((file: FileItem) => {
    toggleFileSelection(file)
  }, [toggleFileSelection])

  const renameFileAction = useCallback((fileId: string, newName: string, isGenerated = false) => {
    renameFile(fileId, newName, isGenerated)
  }, [renameFile])

  const deleteFileAction = useCallback((fileId: string, isGenerated = false) => {
    deleteFile(fileId, isGenerated)
  }, [deleteFile])

  // Create store object with stable methods
  const store = useMemo(() => ({
    userFiles,
    generatedFiles,
    currentPath,
    recentFiles,
    selectedFiles,
    uploadError,
    setUserFiles,
    setGeneratedFiles,
    addFile,
    updateFile,
    deleteFile,
    renameFile,
    setCurrentPath,
    addToRecentFiles,
    clearRecentFiles,
    setSelectedFiles,
    toggleFileSelection,
    setUploadError,
    getFileById,
  }), [
    userFiles,
    generatedFiles,
    currentPath,
    recentFiles,
    selectedFiles,
    uploadError,
    setUserFiles,
    setGeneratedFiles,
    addFile,
    updateFile,
    deleteFile,
    renameFile,
    setCurrentPath,
    addToRecentFiles,
    clearRecentFiles,
    setSelectedFiles,
    toggleFileSelection,
    setUploadError,
    getFileById,
  ])

  return {
    // State
    currentFiles,
    currentPath,
    breadcrumbs,
    recentFiles,
    selectedFiles,
    uploadError,
    
    // Actions
    uploadFile,
    createFolder,
    navigateToPath,
    selectFile,
    renameFile: renameFileAction,
    deleteFile: deleteFileAction,
    
    // Store access with stable reference
    store,
  }
}