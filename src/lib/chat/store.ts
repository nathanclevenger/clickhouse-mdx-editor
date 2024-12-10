import { create } from 'zustand'
import type { ChatMessage, ChatState } from './types'

interface ChatStore extends ChatState {
  setMessages: (messages: ChatMessage[]) => void
  addMessage: (message: ChatMessage) => void
  updateMessage: (id: string, content: string) => void
  setIsStreaming: (isStreaming: boolean) => void
  resetChat: () => void
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isStreaming: false,
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  updateMessage: (id, content) => set((state) => ({
    messages: state.messages.map((msg) =>
      msg.id === id ? { ...msg, content: msg.content + content } : msg
    ),
  })),
  setIsStreaming: (isStreaming) => set({ isStreaming }),
  resetChat: () => set({ messages: [], isStreaming: false }),
}))