import { useCallback, useRef, useEffect } from 'react'
import { useEditorStore } from '@/lib/store'

export function useMDXChat() {
  const { selectedDocument, updateSelectedDocument } = useEditorStore()
  const isFirstChunkRef = useRef(true)

  // Reset first chunk flag when document changes
  useEffect(() => {
    isFirstChunkRef.current = true
  }, [selectedDocument?.id])

  const handleChatContent = useCallback((content: string) => {
    if (!selectedDocument) return content

    try {
      if (isFirstChunkRef.current) {
        updateSelectedDocument(content)
        isFirstChunkRef.current = false
      } else {
        updateSelectedDocument(prev => prev + content)
      }
    } catch (error) {
      console.error('Failed to update editor content:', error)
    }

    return content
  }, [selectedDocument, updateSelectedDocument])

  return { handleChatContent }
}