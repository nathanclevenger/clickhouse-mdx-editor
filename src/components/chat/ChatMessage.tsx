import { memo } from 'react'
import { cn } from '@/lib/utils'
import { MarkdownMessage } from './MarkdownMessage'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
}

export const ChatMessage = memo(function ChatMessage({ role, content, isStreaming }: ChatMessageProps) {
  return (
    <div
      className={cn(
        'rounded-lg',
        role === 'user'
          ? 'bg-accent/20 text-accent-foreground ml-8'
          : 'bg-muted mr-8'
      )}
    >
      <div className="px-4 py-3">
        {content ? (
          <div className="prose-sm dark:prose-invert max-w-none break-words">
            <MarkdownMessage content={content} />
          </div>
        ) : (
          role === 'assistant' && isStreaming && '...'
        )}
      </div>
    </div>
  )
})