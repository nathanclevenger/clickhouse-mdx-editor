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
  isFirstChunk: boolean
  setIsFirstChunk: (isFirst: boolean) => void
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isStreaming: false,
  currentChunk: '',
  isFirstChunk: true,
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
  updateMessage: (id, chunk) => {
    console.log('ChatStore: Updating message:', { id, chunkLength: chunk.length })
    set((state) => {
      const updatedMessages = state.messages.map((msg) => {
        if (msg.id === id) {
          // For assistant messages, append the new chunk
          if (msg.role === 'assistant') {
            const updatedContent = state.isFirstChunk ? chunk : msg.content + chunk
            console.log('ChatStore: Updated message content:', {
              messageId: id,
              isFirstChunk: state.isFirstChunk,
              previousLength: msg.content.length,
              newLength: updatedContent.length
            })
            return { ...msg, content: updatedContent }
          }
        }
        return msg
      })

      return {
        messages: updatedMessages,
        currentChunk: chunk,
        isFirstChunk: false
      }
    })
  },
  setIsStreaming: (isStreaming) => {
    console.log('ChatStore: Setting streaming state:', isStreaming)
    set({ 
      isStreaming, 
      currentChunk: isStreaming ? get().currentChunk : '',
      isFirstChunk: true
    })
  },
  resetChat: () => {
    console.log('ChatStore: Resetting chat')
    set({ 
      messages: [], 
      isStreaming: false, 
      currentChunk: '',
      isFirstChunk: true 
    })
  },
  setCurrentChunk: (chunk) => {
    console.log('ChatStore: Setting current chunk:', { length: chunk.length })
    set({ currentChunk: chunk })
  },
  setIsFirstChunk: (isFirst) => {
    console.log('ChatStore: Setting isFirstChunk:', isFirst)
    set({ isFirstChunk: isFirst })
  }
}))