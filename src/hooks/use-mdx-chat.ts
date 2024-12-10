import { useCallback, useRef, useEffect } from 'react'
import { useEditorStore } from '@/lib/store'

export function useMDXChat() {
  const { selectedDocument, updateSelectedDocument } = useEditorStore()
  const isFirstChunkRef = useRef(true)

  // Reset first chunk flag when document changes
  useEffect(() => {
    console.log('MDXChat: Document changed, resetting first chunk flag')
    isFirstChunkRef.current = true
  }, [selectedDocument?.id])

  const handleChatContent = useCallback((content: string) => {
    if (!selectedDocument) {
      console.warn('MDXChat: No document selected for chat update')
      return content
    }

    console.log('MDXChat: Handling chat content:', {
      isFirstChunk: isFirstChunkRef.current,
      contentLength: content.length,
      documentId: selectedDocument.id
    })

    try {
      if (isFirstChunkRef.current) {
        console.log('MDXChat: Processing first chunk')
        updateSelectedDocument(prev => {
          const separator = prev.trim() ? '\n\n' : ''
          const newContent = `${prev}${separator}${content}`
          console.log('MDXChat: First chunk update:', {
            prevLength: prev.length,
            newLength: newContent.length
          })
          isFirstChunkRef.current = false
          return newContent
        })
      } else {
        console.log('MDXChat: Processing subsequent chunk')
        updateSelectedDocument(prev => {
          const newContent = `${prev}${content}`
          console.log('MDXChat: Subsequent chunk update:', {
            prevLength: prev.length,
            newLength: newContent.length
          })
          return newContent
        })
      }
    } catch (error) {
      console.error('MDXChat: Failed to update editor content:', error)
    }

    return content
  }, [selectedDocument, updateSelectedDocument])

  return { handleChatContent }
}