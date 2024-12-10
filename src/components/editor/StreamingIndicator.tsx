import { useChatStore } from '@/lib/chat/store'

export function StreamingIndicator() {
  const isStreaming = useChatStore(state => state.isStreaming)
  const currentChunk = useChatStore(state => state.currentChunk)

  return (
    <div className={`text-sm ${isStreaming ? 'text-primary animate-pulse' : 'text-muted-foreground'}`}>
      {isStreaming ? currentChunk || 'streaming...' : 'idle'}
    </div>
  )
}