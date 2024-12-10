import { useState, useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ConfigForm } from '../ConfigForm'
import { useEditorStore } from '@/lib/store'
import { ChatMessages } from '../chat/ChatMessages'
import { ChatInput } from '../chat/ChatInput'
import { useChatStore } from '@/lib/chat/store'
import { createMessage } from '@/lib/chat/utils'
import { streamChatResponse } from '@/lib/chat/service'

export function ChatView() {
  console.log('ChatView: Component rendered')
  const { 
    config, 
    selectedDocument, 
    appendToBuffer,
    clearBuffer,
    flushBuffer
  } = useEditorStore()

  const { 
    messages, 
    addMessage, 
    updateMessage, 
    isStreaming, 
    setIsStreaming,
    setCurrentChunk,
    isFirstChunk,
    setIsFirstChunk
  } = useChatStore()

  const [inputValue, setInputValue] = useState('')
  const [showSettings, setShowSettings] = useState(!config?.openaiApiKey)

  const handleSubmit = useCallback(async () => {
    console.log('ChatView: Submit triggered', {
      hasInput: !!inputValue.trim(),
      isStreaming,
      hasDocument: !!selectedDocument
    })

    if (!inputValue.trim() || isStreaming || !selectedDocument) {
      console.log('ChatView: Submission blocked:', { 
        hasInput: !!inputValue.trim(), 
        isStreaming,
        hasDocument: !!selectedDocument
      })
      return
    }
    
    if (!config?.openaiApiKey) {
      console.log('ChatView: No API key, showing settings')
      setShowSettings(true)
      return
    }

    console.log('ChatView: Starting chat submission')
    const userMessage = createMessage(inputValue.trim(), 'user')
    const assistantMessage = createMessage('', 'assistant')

    // Reset states
    clearBuffer()
    setIsFirstChunk(true)
    setCurrentChunk('')
    setInputValue('')
    setIsStreaming(true)

    // Add messages
    addMessage(userMessage)
    addMessage(assistantMessage)

    try {
      console.log('ChatView: Starting stream')
      await streamChatResponse(
        userMessage.content,
        {
          apiKey: config.openaiApiKey,
          model: config.chatModel || 'gpt-4',
        },
        (chunk: string) => {
          console.log('ChatView: Received chunk:', {
            chunk,
            length: chunk.length
          })
          
          // Update message in chat
          updateMessage(assistantMessage.id, chunk)
          
          // Update current chunk display
          setCurrentChunk(chunk)

          // Append to buffer
          appendToBuffer(chunk)
        }
      )

      console.log('ChatView: Stream completed')
      flushBuffer()
    } catch (error) {
      console.error('ChatView: Error in chat stream:', error)
      if (error.name === 'ChatConfigError') {
        setShowSettings(true)
      }
      updateMessage(
        assistantMessage.id,
        'Sorry, there was an error processing your request. Please try again.'
      )
    } finally {
      console.log('ChatView: Finalizing chat submission')
      setIsStreaming(false)
      setCurrentChunk('')
      setIsFirstChunk(true)
      clearBuffer()
    }
  }, [
    inputValue,
    isStreaming,
    config,
    selectedDocument,
    addMessage,
    updateMessage,
    setIsStreaming,
    setCurrentChunk,
    setIsFirstChunk,
    appendToBuffer,
    clearBuffer,
    flushBuffer
  ])

  return (
    <div className='flex flex-col h-full'>
      <div className='flex-1 min-h-0 relative'>
        <ChatMessages />
      </div>
      <div className='shrink-0 border-t bg-background'>
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSubmit={handleSubmit}
          isStreaming={isStreaming}
          onSettingsClick={() => !config?.openaiApiKey && setShowSettings(true)}
        />
      </div>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AI Settings</DialogTitle>
          </DialogHeader>
          <ConfigForm 
            isDialog 
            autoFocusField="openaiApiKey" 
            onClose={() => setShowSettings(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}