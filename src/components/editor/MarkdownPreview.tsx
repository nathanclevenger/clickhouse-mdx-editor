import { ScrollArea } from '@/components/ui/scroll-area'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownPreviewProps {
  content: string
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  if (!content?.trim()) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No content to preview
      </div>
    )
  }

  // Remove YAML frontmatter before rendering
  const contentWithoutFrontmatter = content.replace(/^---\n[\s\S]*?\n---\n/, '')

  return (
    <ScrollArea className="h-full">
      <div className="prose dark:prose-invert max-w-none p-8">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {contentWithoutFrontmatter}
        </ReactMarkdown>
      </div>
    </ScrollArea>
  )
}