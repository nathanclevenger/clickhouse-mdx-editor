import { useCallback, useRef, useEffect } from 'react'
import { useEditorStore } from '@/lib/store'

export function useMDXChat() {
  const { selectedDocument, appendText } = useEditorStore()
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
      // Add newline before first chunk only
      appendText(content, isFirstChunkRef.current)
      isFirstChunkRef.current = false
    } catch (error) {
      console.error('MDXChat: Failed to update editor content:', error)
    }

    return content
  }, [selectedDocument, appendText])

  return { handleChatContent }
}