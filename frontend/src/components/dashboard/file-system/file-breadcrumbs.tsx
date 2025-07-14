"use client"

import { ChevronRight, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { BreadcrumbItem } from "@/types/file-system"

interface FileBreadcrumbsProps {
  breadcrumbs: BreadcrumbItem[]
  onNavigate: (path: string) => void
}

export function FileBreadcrumbs({ breadcrumbs, onNavigate }: FileBreadcrumbsProps) {
  return (
    <div className="flex items-center gap-1 p-2 border-b bg-muted/30">
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.id} className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-7 px-2 text-sm" onClick={() => onNavigate(crumb.path)}>
            {index === 0 ? <Home className="h-3 w-3 mr-1" /> : null}
            {crumb.name}
          </Button>
          {index < breadcrumbs.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
        </div>
      ))}
    </div>
  )
}
