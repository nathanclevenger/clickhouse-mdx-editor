import { useRef, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Send, Type } from 'lucide-react'
import { useEditorStore } from '@/lib/store'

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  isStreaming: boolean
  onSettingsClick: () => void
}

export function ChatInput({ 
  value, 
  onChange, 
  onSubmit, 
  isStreaming,
  onSettingsClick 
}: ChatInputProps) {
  const { setChatInputRef, updateSelectedDocument } = useEditorStore()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0

  useEffect(() => {
    setChatInputRef(textareaRef)
  }, [setChatInputRef])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSubmit()
    }
  }

  const handleTestAppend = () => {
    const loremText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    updateSelectedDocument(prev => `${prev}\n\n${loremText}`)
  }

  return (
    <div className='p-4'>
      <form 
        onSubmit={(e) => { 
          e.preventDefault()
          onSubmit()
        }} 
        className='flex gap-2'
      >
        <Textarea
          ref={textareaRef}
          placeholder={`Type a message... (${isMac ? '⌘' : 'Ctrl'}+L)`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onClick={onSettingsClick}
          className='min-h-[58px] max-h-[200px] resize-none'
          rows={2}
        />
        <div className='flex flex-col gap-2'>
          <Button 
            type='submit' 
            size='icon'
            className='h-[58px] w-[58px] shrink-0'
            disabled={!value.trim() || isStreaming}
            onClick={(e) => {
              e.preventDefault()
              if (!value.trim() || isStreaming) {
                onSettingsClick()
              } else {
                onSubmit()
              }
            }}
          >
            <Send className='h-5 w-5' />
          </Button>
          <Button
            type='button'
            size='icon'
            variant='outline'
            className='h-[58px] w-[58px] shrink-0'
            onClick={handleTestAppend}
          >
            <Type className='h-5 w-5' />
          </Button>
        </div>
      </form>
    </div>
  )
}