import { useChatStore } from '@/lib/chat/store'
import { useEditorStore } from '@/lib/store'

export function StreamingIndicator() {
  const isStreaming = useChatStore(state => state.isStreaming)
  const currentChunk = useChatStore(state => state.currentChunk)
  const buffer = useEditorStore(state => state.buffer)

  return (
    <div className="flex items-center justify-between w-full text-sm">
      <div className="text-muted-foreground truncate flex-1 pr-4">
        buffer: {buffer || '<empty>'}
      </div>
      <div className={`shrink-0 ${isStreaming ? 'text-primary animate-pulse' : 'text-muted-foreground'}`}>
        chunk: {isStreaming ? currentChunk || 'streaming...' : 'idle'}
      </div>
    </div>
  )
}