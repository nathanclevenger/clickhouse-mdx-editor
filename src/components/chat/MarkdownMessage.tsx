import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'

interface MarkdownMessageProps {
  content: string
  className?: string
}

export function MarkdownMessage({ content, className }: MarkdownMessageProps) {
  return (
    <div className={cn('prose dark:prose-invert max-w-none', className)}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          a: ({ href, children }) => (
            <a 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80"
            >
              {children}
            </a>
          ),
          code: ({ node, inline, className, children, ...props }) => (
            <code
              className={cn(
                "bg-muted px-1.5 py-0.5 rounded text-sm font-mono",
                className
              )}
              {...props}
            >
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              {children}
            </pre>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}