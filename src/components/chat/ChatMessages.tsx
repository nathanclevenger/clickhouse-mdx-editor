import { StickToBottom, useStickToBottomContext } from 'use-stick-to-bottom'
import { ChatMessage } from './ChatMessage'
import { useChatStore } from '@/lib/chat/store'
import { ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ChatMessages() {
  const { messages, isStreaming } = useChatStore()

  return (
    <StickToBottom className='h-full relative' resize='smooth' initial='smooth'>
      <StickToBottom.Content className='space-y-3 p-4'>
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            role={message.role}
            content={message.content}
            isStreaming={isStreaming && message.id === messages[messages.length - 1]?.id}
          />
        ))}
      </StickToBottom.Content>
      <ScrollToBottom />
    </StickToBottom>
  )
}

function ScrollToBottom() {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext()

  if (isAtBottom) return null

  return (
    <Button
      variant='secondary'
      size='icon'
      className='absolute bottom-4 right-4 rounded-full shadow-lg'
      onClick={() => scrollToBottom()}
    >
      <ArrowDown className='h-4 w-4' />
    </Button>
  )
}