import { nanoid } from 'nanoid'
import type { ChatMessage } from './types'

export function createMessage(content: string, role: 'user' | 'assistant'): ChatMessage {
  return {
    id: nanoid(),
    role,
    content,
  }
}

export function scrollToBottom(element: HTMLElement | null) {
  if (element) {
    const scrollHeight = element.scrollHeight
    const height = element.clientHeight
    const maxScrollTop = scrollHeight - height
    
    element.scrollTo({
      top: maxScrollTop,
      behavior: 'smooth'
    })
  }
}