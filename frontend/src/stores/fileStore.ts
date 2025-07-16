// frontend/src/stores/fileStore.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { FileItem, BreadcrumbItem } from '@/types/file-system'

interface FileStore {
  // State
  userFiles: FileItem[]
  generatedFiles: FileItem[]
  currentPath: string
  recentFiles: FileItem[]
  selectedFiles: FileItem[]
  uploadError: string | null

  // Actions - stable references only
  setUserFiles: (files: FileItem[]) => void
  setGeneratedFiles: (files: FileItem[]) => void
  addFile: (file: FileItem, isGenerated?: boolean) => void
  updateFile: (fileId: string, updates: Partial<FileItem>, isGenerated?: boolean) => void
  deleteFile: (fileId: string, isGenerated?: boolean) => void
  renameFile: (fileId: string, newName: string, isGenerated?: boolean) => void
  setCurrentPath: (path: string) => void
  addToRecentFiles: (file: FileItem) => void
  clearRecentFiles: () => void
  setSelectedFiles: (files: FileItem[]) => void
  toggleFileSelection: (file: FileItem) => void
  setUploadError: (error: string | null) => void
}

// Helper functions outside the store to avoid recreation
const getAllFiles = (userFiles: FileItem[], generatedFiles: FileItem[]) => {
  return [...userFiles, ...generatedFiles]
}

const getCurrentFiles = (userFiles: FileItem[], generatedFiles: FileItem[], currentPath: string) => {
  const allFiles = getAllFiles(userFiles, generatedFiles)
  
  if (currentPath === "/") {
    return allFiles.filter(file => !file.parentId)
  }
  
  const pathParts = currentPath.split("/").filter(Boolean)
  let currentId: string | null = null
  
  for (const part of pathParts) {
    const folder = allFiles.find(f => f.type === "folder" && f.name === part && f.parentId === currentId)
    if (folder) {
      currentId = folder.id
    }
  }
  
  return allFiles.filter(file => file.parentId === currentId)
}

const getFileById = (userFiles: FileItem[], generatedFiles: FileItem[], fileId: string) => {
  const allFiles = getAllFiles(userFiles, generatedFiles)
  return allFiles.find(file => file.id === fileId)
}

const getBreadcrumbs = (userFiles: FileItem[], generatedFiles: FileItem[], currentPath: string): BreadcrumbItem[] => {
  if (currentPath === "/") {
    return [{ id: "root", name: "Root", path: "/" }]
  }

  const parts = currentPath.split("/").filter(Boolean)
  const breadcrumbs = [{ id: "root", name: "Root", path: "/" }]
  const allFiles = getAllFiles(userFiles, generatedFiles)

  let currentId: string | null = null
  let currentPathBuilder = ""

  for (const part of parts) {
    currentPathBuilder += `/${part}`
    const folder = allFiles.find(f => f.type === "folder" && f.name === part && f.parentId === currentId)
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

const deleteRecursive = (files: FileItem[], idToDelete: string): FileItem[] => {
  const children = files.filter(f => f.parentId === idToDelete)
  children.forEach(child => deleteRecursive(files, child.id))
  return files.filter(f => f.id !== idToDelete && f.parentId !== idToDelete)
}

export const useFileStore = create<FileStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      userFiles: [],
      generatedFiles: [
        {
          id: "gen_1",
          name: "Project Summary.pdf",
          type: "file",
          size: 245760,
          lastModified: new Date("2024-01-15T10:30:00"),
          parentId: null,
          path: "/Project Summary.pdf",
          mimeType: "application/pdf",
          content: "This is the content of the generated project summary.",
          versions: [],
        },
        {
          id: "gen_2",
          name: "Meeting Notes.docx",
          type: "file",
          size: 89120,
          lastModified: new Date("2024-01-14T14:20:00"),
          parentId: null,
          path: "/Meeting Notes.docx",
          mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          content: "Detailed notes from the team meeting.",
          versions: [],
        },
      ],
      currentPath: "/",
      recentFiles: [],
      selectedFiles: [],
      uploadError: null,

      // Actions
      setUserFiles: (files) => set({ userFiles: files }),
      
      setGeneratedFiles: (files) => set({ generatedFiles: files }),
      
      addFile: (file, isGenerated = false) => set((state) => {
        const fileArray = isGenerated ? 'generatedFiles' : 'userFiles'
        const newRecentFiles = [file, ...state.recentFiles.filter(f => f.id !== file.id)].slice(0, 10)
        
        return {
          [fileArray]: [...state[fileArray], file],
          recentFiles: newRecentFiles
        }
      }),
      
      updateFile: (fileId, updates, isGenerated = false) => set((state) => {
        const fileArray = isGenerated ? 'generatedFiles' : 'userFiles'
        return {
          [fileArray]: state[fileArray].map(file => 
            file.id === fileId ? { ...file, ...updates, lastModified: new Date() } : file
          )
        }
      }),
      
      deleteFile: (fileId, isGenerated = false) => set((state) => {
        const fileArray = isGenerated ? 'generatedFiles' : 'userFiles'
        
        return {
          [fileArray]: deleteRecursive(state[fileArray], fileId),
          recentFiles: state.recentFiles.filter(file => file.id !== fileId),
          selectedFiles: state.selectedFiles.filter(file => file.id !== fileId)
        }
      }),
      
      renameFile: (fileId, newName, isGenerated = false) => set((state) => {
        const fileArray = isGenerated ? 'generatedFiles' : 'userFiles'
        return {
          [fileArray]: state[fileArray].map(file => {
            if (file.id === fileId) {
              const parentPath = file.parentId ? 
                state[fileArray].find(f => f.id === file.parentId)?.path || "" : ""
              return {
                ...file,
                name: newName,
                path: `${parentPath}/${newName}`,
                lastModified: new Date(),
              }
            }
            return file
          })
        }
      }),
      
      setCurrentPath: (path) => set({ currentPath: path }),
      
      addToRecentFiles: (file) => set((state) => ({
        recentFiles: [file, ...state.recentFiles.filter(f => f.id !== file.id)].slice(0, 10)
      })),
      
      clearRecentFiles: () => set({ recentFiles: [] }),
      
      setSelectedFiles: (files) => set({ selectedFiles: files }),
      
      toggleFileSelection: (file) => set((state) => {
        const isSelected = state.selectedFiles.some(f => f.id === file.id)
        return {
          selectedFiles: isSelected 
            ? state.selectedFiles.filter(f => f.id !== file.id)
            : [...state.selectedFiles, file]
        }
      }),
      
      setUploadError: (error) => set({ uploadError: error }),
    }),
    { name: 'file-store' }
  )
)

// Export helper functions that components can use
export const fileStoreSelectors = {
  getCurrentFiles: (userFiles: FileItem[], generatedFiles: FileItem[], currentPath: string) => 
    getCurrentFiles(userFiles, generatedFiles, currentPath),
  
  getFileById: (userFiles: FileItem[], generatedFiles: FileItem[], fileId: string) => 
    getFileById(userFiles, generatedFiles, fileId),
  
  getBreadcrumbs: (userFiles: FileItem[], generatedFiles: FileItem[], currentPath: string) => 
    getBreadcrumbs(userFiles, generatedFiles, currentPath),
}