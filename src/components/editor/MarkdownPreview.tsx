import { ScrollArea } from '@/components/ui/scroll-area'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useChatStore } from '@/lib/chat/store'
import { useEditorStore } from '@/lib/store'

interface MarkdownPreviewProps {
  content: string
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  const isStreaming = useChatStore(state => state.isStreaming)
  const buffer = useEditorStore(state => state.buffer)

  // During streaming, show only the buffer content
  const previewContent = isStreaming 
    ? buffer
    : content.replace(/^---\n[\s\S]*?\n---\n/, '') // Remove frontmatter when not streaming

  if (!previewContent?.trim()) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        {isStreaming ? 'Waiting for content...' : 'No content to preview'}
      </div>
    )
  }

  return (
    <ScrollArea className="h-full">
      <div className="prose dark:prose-invert max-w-none p-4">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {previewContent}
        </ReactMarkdown>
      </div>
    </ScrollArea>
  )
}