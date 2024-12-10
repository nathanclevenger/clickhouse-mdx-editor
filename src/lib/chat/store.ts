import { create } from 'zustand'
import type { ChatMessage, ChatState } from './types'

interface ChatStore extends ChatState {
  setMessages: (messages: ChatMessage[]) => void
  addMessage: (message: ChatMessage) => void
  updateMessage: (id: string, content: string) => void
  setIsStreaming: (isStreaming: boolean) => void
  resetChat: () => void
  currentChunk: string
  setCurrentChunk: (chunk: string) => void
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isStreaming: false,
  currentChunk: '',
  setMessages: (messages) => {
    console.log('ChatStore: Setting messages:', messages.length)
    set({ messages })
  },
  addMessage: (message) => {
    console.log('ChatStore: Adding message:', message.id)
    set((state) => ({ 
      messages: [...state.messages, message] 
    }))
  },
  updateMessage: (id, content) => {
    console.log('ChatStore: Updating message:', { id, contentLength: content.length })
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, content: msg.content + content } : msg
      ),
      currentChunk: content
    }))
  },
  setIsStreaming: (isStreaming) => {
    console.log('ChatStore: Setting streaming state:', isStreaming)
    set({ isStreaming, currentChunk: isStreaming ? get().currentChunk : '' })
  },
  resetChat: () => {
    console.log('ChatStore: Resetting chat')
    set({ messages: [], isStreaming: false, currentChunk: '' })
  },
  setCurrentChunk: (chunk) => {
    set({ currentChunk: chunk })
  }
}))