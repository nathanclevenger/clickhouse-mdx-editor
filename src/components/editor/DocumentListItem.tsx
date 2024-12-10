import { Document } from '@/lib/types'
import { formatMetadata, getDocumentContent } from '@/lib/utils'

interface DocumentListItemProps {
  document: Document
  isSelected: boolean
  onClick: () => void
}

export function DocumentListItem({ document, isSelected, onClick }: DocumentListItemProps) {
  console.log('DocumentListItem: Rendering', { 
    id: document.id, 
    isSelected 
  })

  const data = JSON.parse(document.data)
  const displayName = data._name || data._id?.split('/').pop() || document.id
  const metadata = formatMetadata(data)
  const content = getDocumentContent(document.mdx)

  return (
    <div
      className={`border-b last:border-b-0 border-border/40 cursor-pointer ${
        isSelected ? 'bg-accent text-accent-foreground' : 'hover:bg-muted/50'
      }`}
      onClick={() => {
        console.log('DocumentListItem: Selected', document.id)
        onClick()
      }}
    >
      <div className='p-3 space-y-1'>
        <div className='font-medium truncate'>{displayName}</div>
        {metadata && (
          <div className='text-sm text-muted-foreground truncate font-mono'>{metadata}</div>
        )}
        {content && (
          <div className='text-sm text-muted-foreground truncate'>{content}</div>
        )}
      </div>
    </div>
  )
}