"use client"

import React from "react"

import { useState } from "react"
import {
  Search,
  Plus,
  MessageSquare,
  SortAsc,
  SortDesc,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Loader2,
  MoreVertical,
  Edit,
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { ChatSidebarProps, Conversation, SortOrder, SortType } from "@/types/chat"
import { useConversations } from "@/hooks/use-conversations"

export function ChatSidebar({ isOpen, onToggle, activeConversationId, onConversationSelect }: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortType>("date")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [conversationToDelete, setConversationToDelete] = useState<number | null>(null)
  const [conversationToRename, setConversationToRename] = useState<Conversation | null>(null)
  const [newTitle, setNewTitle] = useState("")

  const { conversations, isLoading, createNewConversation, deleteConversation, renameConversation, loadConversation } =
    useConversations()

  // Update filtered conversations when conversations change
  React.useEffect(() => {
    let filtered = conversations

    if (searchQuery.trim()) {
      const keywords = searchQuery
        .toLowerCase()
        .split(" ")
        .filter((word) => word.length > 0)
      filtered = conversations.filter((conv) => {
        const searchText = `${conv.title} ${conv.preview}`.toLowerCase()
        return keywords.some((keyword) => searchText.includes(keyword))
      })
    }

    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0

      if (sortBy === "name") {
        comparison = a.title.localeCompare(b.title)
      } else {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

    setFilteredConversations(sorted)
  }, [conversations, searchQuery, sortBy, sortOrder])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleSort = (type: SortType) => {
    if (sortBy === type) {
      // Toggle sort order if clicking the same sort type
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      // Set new sort type with default order
      setSortBy(type)
      setSortOrder(type === "date" ? "desc" : "asc")
    }
  }

  const handleNewChat = async () => {
    try {
      const newConversation = await createNewConversation()
      onConversationSelect(newConversation)
    } catch (error) {
      console.error("Failed to create new conversation:", error)
    }
  }

  const handleDeleteClick = (conversationId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setConversationToDelete(conversationId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (conversationToDelete) {
      try {
        await deleteConversation(conversationToDelete)
        setDeleteDialogOpen(false)
        setConversationToDelete(null)
      } catch (error) {
        console.error("Failed to delete conversation:", error)
      }
    }
  }

  const handleRenameClick = (conversation: Conversation, e: React.MouseEvent) => {
    e.stopPropagation()
    setConversationToRename(conversation)
    setNewTitle(conversation.title)
    setRenameDialogOpen(true)
  }

  const handleRenameConfirm = async () => {
    if (conversationToRename && newTitle.trim()) {
      try {
        await renameConversation(conversationToRename.id, newTitle.trim())
        setRenameDialogOpen(false)
        setConversationToRename(null)
        setNewTitle("")
      } catch (error) {
        console.error("Failed to rename conversation:", error)
      }
    }
  }

  const handleConversationClick = async (conversation: Conversation) => {
    try {
      const result = await loadConversation(conversation.id)
      if (result) {
        onConversationSelect(conversation)
      }
    } catch (error) {
      console.error("Failed to load conversation:", error)
    }
  }

  const getSortIcon = (type: SortType) => {
    if (sortBy !== type) return <SortAsc className="w-3 h-3 mr-1" />
    return sortOrder === "asc" ? <SortAsc className="w-3 h-3 mr-1" /> : <SortDesc className="w-3 h-3 mr-1" />
  }

  return (
    <TooltipProvider>
      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-80 bg-background border-r transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Content */}
          <div className="flex-1 overflow-y-auto px-2 py-4">
            <Accordion type="single" collapsible defaultValue="messages" className="w-full">
              <AccordionItem value="messages">
                <AccordionTrigger className="px-2 py-3 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Messages
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-2 pb-4">
                  <div className="space-y-3">
                    {/* New Chat Button - Sleeker and smaller */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleNewChat}
                          disabled={isLoading}
                          className="w-full h-8 text-xs bg-transparent"
                        >
                          {isLoading ? (
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          ) : (
                            <Plus className="w-3 h-3 mr-1" />
                          )}
                          New Chat
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Start a new conversation</TooltipContent>
                    </Tooltip>

                    {/* Sort Controls */}
                    <div className="flex gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={sortBy === "name" ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => handleSort("name")}
                            className="flex-1 text-xs"
                          >
                            {getSortIcon("name")}
                            Name
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Sort by name {sortBy === "name" && `(${sortOrder})`}</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={sortBy === "date" ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => handleSort("date")}
                            className="flex-1 text-xs"
                          >
                            {getSortIcon("date")}
                            Date
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Sort by date {sortBy === "date" && `(${sortOrder})`}</TooltipContent>
                      </Tooltip>
                    </div>

                    {/* Conversations List */}
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {filteredConversations.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">
                            {searchQuery.trim() ? "No matching conversations" : "No conversations yet"}
                          </p>
                          {searchQuery.trim() && (
                            <p className="text-xs mt-1">Try different keywords or create a new chat</p>
                          )}
                        </div>
                      ) : (
                        filteredConversations.map((conv) => (
                          <div
                            key={conv.id}
                            className={cn(
                              "relative p-2 rounded-lg cursor-pointer transition-all group",
                              activeConversationId === conv.id
                                ? "bg-accent shadow-md ring-2 ring-primary/20"
                                : "hover:bg-accent",
                            )}
                            onClick={() => handleConversationClick(conv)}
                          >
                            <div className="font-medium text-sm truncate pr-16">{conv.title}</div>
                            <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{conv.preview}</div>
                            <div className="text-xs text-muted-foreground mt-1">{conv.date}</div>

                            {/* Action Buttons */}
                            <div className="absolute bottom-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-6 w-6 hover:bg-accent-foreground/10"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <MoreVertical className="h-3 w-3" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>More actions</TooltipContent>
                                  </Tooltip>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" side="top">
                                  <DropdownMenuItem onClick={(e) => handleRenameClick(conv, e)}>
                                    <Edit className="mr-2 h-3 w-3" />
                                    Rename
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6 hover:bg-destructive hover:text-destructive-foreground"
                                    onClick={(e) => handleDeleteClick(conv.id, e)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Delete conversation</TooltipContent>
                              </Tooltip>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-8 h-9"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="templates">
                <AccordionTrigger className="px-2 py-3 hover:no-underline">Templates</AccordionTrigger>
                <AccordionContent className="px-2 pb-4">
                  <div className="text-sm text-muted-foreground">Template section - coming soon</div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="history">
                <AccordionTrigger className="px-2 py-3 hover:no-underline">History</AccordionTrigger>
                <AccordionContent className="px-2 pb-4">
                  <div className="text-sm text-muted-foreground">History section - coming soon</div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="settings">
                <AccordionTrigger className="px-2 py-3 hover:no-underline">Preferences</AccordionTrigger>
                <AccordionContent className="px-2 pb-4">
                  <div className="text-sm text-muted-foreground">Preferences section - coming soon</div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onToggle}
            size="icon"
            variant="outline"
            className={cn(
              "fixed top-1/2 -translate-y-1/2 z-50 h-12 w-6 rounded-r-lg rounded-l-none border-l-0 transition-all duration-300 ease-in-out",
              isOpen ? "left-80" : "left-0",
            )}
          >
            {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">Toggle sidebar</TooltipContent>
      </Tooltip>

      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 z-30 bg-black/20 md:hidden" onClick={onToggle} />}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={(open) => !open && setDeleteDialogOpen(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this conversation? This action cannot be undone and will permanently
              remove the conversation from your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Conversation</DialogTitle>
            <DialogDescription>Enter a new title for this conversation.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Conversation title"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleRenameConfirm()
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRenameConfirm} disabled={!newTitle.trim()}>
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}
