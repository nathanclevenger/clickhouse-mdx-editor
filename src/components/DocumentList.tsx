import { useEditorStore } from '@/lib/store'
import { ScrollArea } from '@/components/ui/scroll-area'
import { DocumentListItem } from './editor/DocumentListItem'

export function DocumentList() {
  const { documents, selectedDocument, setSelectedDocument } = useEditorStore()

  return (
    <ScrollArea className='h-full'>
      <div className='p-4 space-y-2' role='list'>
        {documents.length === 0 ? (
          <div className='text-center text-muted-foreground p-4'>
            No documents found in this namespace
          </div>
        ) : (
          documents.map((doc) => (
            <DocumentListItem
              key={doc.id}
              document={doc}
              isSelected={selectedDocument?.id === doc.id}
              onClick={() => setSelectedDocument(doc)}
            />
          ))
        )}
      </div>
    </ScrollArea>
  )
}