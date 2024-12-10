import { memo } from 'react'
import { cn } from '@/lib/utils'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
}

export const ChatMessage = memo(function ChatMessage({ role, content, isStreaming }: ChatMessageProps) {
  return (
    <div
      className={cn(
        'p-4 rounded-lg break-words',
        role === 'user'
          ? 'bg-primary text-primary-foreground ml-8'
          : 'bg-muted mr-8'
      )}
    >
      {content || (role === 'assistant' && isStreaming ? '...' : '')}
    </div>
  )
})