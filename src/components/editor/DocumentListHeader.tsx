import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useEditorStore } from '@/lib/store'
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcut'
import { useRef } from 'react'

export function DocumentListHeader() {
  const { setSearchQuery, addDocument, setActiveTab, activeTab } = useEditorStore()
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
  const searchInputRef = useRef<HTMLInputElement>(null)

  useKeyboardShortcut('k', () => {
    setActiveTab('db')
    setTimeout(() => searchInputRef.current?.focus(), 0)
  })

  return (
    <div className='flex h-[45px] items-center gap-2 border-b px-2'>
      <div className='relative flex-1'>
        <Search className='absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none' />
        <Input
          ref={searchInputRef}
          placeholder={`Search... (${isMac ? '⌘' : 'Ctrl'}+K)`}
          className='h-8 pl-8'
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <Button
        variant='ghost'
        size='icon'
        className='h-8 w-8'
        onClick={() => addDocument()}
      >
        <Plus className='h-4 w-4' />
      </Button>
    </div>
  )
}