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

  // Use individual selectors to prevent unnecessary re-renders
  const config = useEditorStore(state => state.config)
  const selectedDocument = useEditorStore(state => state.selectedDocument)
  const updateSelectedDocument = useEditorStore(state => state.updateSelectedDocument)
  
  const messages = useChatStore(state => state.messages)
  const addMessage = useChatStore(state => state.addMessage)
  const updateMessage = useChatStore(state => state.updateMessage)
  const isStreaming = useChatStore(state => state.isStreaming)
  const setIsStreaming = useChatStore(state => state.setIsStreaming)
  const setCurrentChunk = useChatStore(state => state.setCurrentChunk)

  const [inputValue, setInputValue] = useState('')
  const [showSettings, setShowSettings] = useState(!config?.openaiApiKey)
  const [isFirstChunk, setIsFirstChunk] = useState(true)

  console.log('ChatView: Current state:', {
    hasConfig: !!config,
    hasSelectedDocument: !!selectedDocument,
    messageCount: messages.length,
    isStreaming,
    inputValue: inputValue.length,
    isFirstChunk
  })

  const handleSubmit = useCallback(async () => {
    console.log('ChatView: Submit triggered')

    if (!inputValue.trim() || isStreaming) {
      console.log('ChatView: Submission blocked:', { 
        hasInput: !!inputValue.trim(), 
        isStreaming 
      })
      return
    }
    
    if (!config?.openaiApiKey) {
      console.log('ChatView: No API key, showing settings')
      setShowSettings(true)
      return
    }

    if (!selectedDocument) {
      console.log('ChatView: No document selected')
      return
    }

    console.log('ChatView: Starting chat submission')
    setIsFirstChunk(true)

    const userMessage = createMessage(inputValue.trim(), 'user')
    const assistantMessage = createMessage('', 'assistant')

    console.log('ChatView: Adding messages to store')
    addMessage(userMessage)
    setInputValue('')
    setIsStreaming(true)
    addMessage(assistantMessage)

    try {
      console.log('ChatView: Starting stream')
      await streamChatResponse(
        userMessage.content,
        {
          apiKey: config.openaiApiKey,
          model: config.chatModel || 'gpt-4',
        },
        (chunk) => {
          console.log('ChatView: Received chunk:', { 
            length: chunk.length,
            isFirstChunk 
          })

          // Update current chunk in store
          setCurrentChunk(chunk)

          // Update document content
          updateSelectedDocument(prev => {
            if (isFirstChunk) {
              console.log('ChatView: Processing first chunk')
              setIsFirstChunk(false)
              const separator = prev.trim() ? '\n\n' : ''
              return `${prev}${separator}${chunk}`
            } else {
              console.log('ChatView: Processing subsequent chunk')
              return `${prev}${chunk}`
            }
          })

          // Update chat message
          console.log('ChatView: Updating message:', assistantMessage.id)
          updateMessage(assistantMessage.id, chunk)
        }
      )
      console.log('ChatView: Stream completed')
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
      setIsFirstChunk(true)
      setCurrentChunk('')
    }
  }, [
    inputValue,
    isStreaming,
    config,
    selectedDocument,
    updateSelectedDocument,
    addMessage,
    updateMessage,
    setIsStreaming,
    setCurrentChunk,
    isFirstChunk
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