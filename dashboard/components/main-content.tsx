"use client"
import { ChatInterface } from "./chat-interface"

export function MainContent() {
  return (
    <main className="flex-1 overflow-auto h-full w-full">
      <div className="p-6 h-full flex flex-col w-full">
        <div className="w-full max-w-none flex-1 flex flex-col">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
            <p className="text-muted-foreground">Start a conversation or explore your dashboard features.</p>
          </div>

          <ChatInterface />
        </div>
      </div>
    </main>
  )
}
