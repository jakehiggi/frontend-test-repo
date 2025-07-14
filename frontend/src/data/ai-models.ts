import type { AIModel } from "@/types/chat"

export const availableModels: AIModel[] = [
  {
    id: "gpt-4",
    name: "GPT-4",
    description: "Most capable model for complex tasks",
    provider: "OpenAI",
  },
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    description: "Fast and efficient for most tasks",
    provider: "OpenAI",
  },
  {
    id: "claude-3-opus",
    name: "Claude 3 Opus",
    description: "Anthropic's most powerful model",
    provider: "Anthropic",
  },
  {
    id: "claude-3-sonnet",
    name: "Claude 3 Sonnet",
    description: "Balanced performance and speed",
    provider: "Anthropic",
  },
  {
    id: "gemini-pro",
    name: "Gemini Pro",
    description: "Google's advanced AI model",
    provider: "Google",
  },
]
