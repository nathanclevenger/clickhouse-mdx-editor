import { useState, useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ConfigForm } from '../ConfigForm'
import { useEditorStore } from '@/lib/store'
import { ChatMessages } from '../chat/ChatMessages'
import { ChatInput } from '../chat/ChatInput'
import { useChatStore } from '@/lib/chat/store'
import { createMessage } from '@/lib/chat/utils'
import { streamChatResponse } from '@/lib/chat/service'
import { useMDXChat } from '@/hooks/use-mdx-chat'

export function ChatView() {
  const { config, selectedDocument, updateSelectedDocument } = useEditorStore()
  const { messages, addMessage, updateMessage, setIsStreaming, isStreaming } = useChatStore()
  const [inputValue, setInputValue] = useState('')
  const [showSettings, setShowSettings] = useState(!config?.openaiApiKey)
  const { handleChatContent } = useMDXChat()

  const handleSubmit = useCallback(async () => {
    if (!inputValue.trim() || isStreaming || !selectedDocument) return
    if (!config?.openaiApiKey) {
      setShowSettings(true)
      return
    }

    const userMessage = createMessage(inputValue.trim(), 'user')
    const assistantMessage = createMessage('', 'assistant')

    // Append user message to editor
    updateSelectedDocument(prev => `${prev}\n\n> ${userMessage.content}`)

    addMessage(userMessage)
    setInputValue('')
    setIsStreaming(true)
    addMessage(assistantMessage)

    try {
      await streamChatResponse(
        userMessage.content,
        {
          apiKey: config.openaiApiKey,
          model: config.chatModel || 'gpt-4',
        },
        (chunk) => {
          const processedChunk = handleChatContent(chunk)
          if (processedChunk) {
            updateMessage(assistantMessage.id, processedChunk)
          }
        }
      )
    } catch (error) {
      console.error('Chat error:', error)
      if (error.name === 'ChatConfigError') {
        setShowSettings(true)
      }
      updateMessage(
        assistantMessage.id,
        'Sorry, there was an error processing your request. Please try again.'
      )
    } finally {
      setIsStreaming(false)
    }
  }, [inputValue, isStreaming, config, addMessage, updateMessage, setIsStreaming, handleChatContent, selectedDocument, updateSelectedDocument])

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