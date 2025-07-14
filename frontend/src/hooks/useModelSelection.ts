"use client"

import { useState } from "react"
import type { AIModel } from "@/types/chat"
import { availableModels } from "@/data/ai-models"

export function useModelSelection() {
  const [selectedModel, setSelectedModel] = useState<AIModel>(availableModels[0])

  const selectModel = (modelId: string) => {
    const model = availableModels.find((m) => m.id === modelId)
    if (model) {
      setSelectedModel(model)
    }
  }

  return {
    selectedModel,
    availableModels,
    selectModel,
  }
}
