import { useEditorStore } from '@/lib/store'
import { ScrollArea } from '@/components/ui/scroll-area'
import { DocumentListItem } from './DocumentListItem'
import { useState, useEffect, useRef } from 'react'

export function DocumentList() {
  const { documents, selectedDocument, setSelectedDocument, searchQuery } = useEditorStore()
  const [isScrolling, setIsScrolling] = useState(false)
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null)
  const [isAtBoundary, setIsAtBoundary] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const lastScrollTop = useRef(0)

  const filteredDocuments = documents.filter((doc) => {
    if (!searchQuery) return true
    const searchLower = searchQuery.toLowerCase()
    return (
      doc.id.toLowerCase().includes(searchLower) ||
      JSON.parse(doc.data).name?.toLowerCase().includes(searchLower)
    )
  })

  useEffect(() => {
    return () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }
    }
  }, [scrollTimeout])

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget
    const scrollTop = target.scrollTop
    const scrollHeight = target.scrollHeight
    const clientHeight = target.clientHeight
    const isTop = scrollTop === 0
    const isBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 1
    const isScrollingUp = scrollTop < lastScrollTop.current

    if ((isTop && isScrollingUp) || (isBottom && !isScrollingUp)) {
      setIsAtBoundary(true)
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }
      const timeout = setTimeout(() => {
        setIsAtBoundary(false)
      }, 150)
      setScrollTimeout(timeout)
    }

    lastScrollTop.current = scrollTop
  }

  return (
    <ScrollArea className='h-full' onScroll={handleScroll}>
      <div 
        ref={scrollRef}
        className={`divide-y divide-border/40 transition-transform ${
          isAtBoundary ? 'animate-bounce-scroll' : ''
        }`}
        role='list'
      >
        {filteredDocuments.length === 0 ? (
          <div className='text-center text-muted-foreground p-4'>
            {documents.length === 0 ? 'No documents found' : 'No matching documents'}
          </div>
        ) : (
          filteredDocuments.map((doc) => (
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