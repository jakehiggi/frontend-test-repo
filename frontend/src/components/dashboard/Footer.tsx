"use client"

export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-20 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-12 items-center justify-end px-4 gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xs">AI</span>
          </div>
          <span>© 2024 AI Chat Company. All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}
