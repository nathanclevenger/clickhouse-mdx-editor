import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useEditorStore } from '@/lib/store'
import { useRef, useEffect } from 'react'

export function SearchHeader() {
  const { setSearchQuery, addDocument, setSearchInputRef } = useEditorStore()
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setSearchInputRef(searchInputRef)
  }, [setSearchInputRef])

  return (
    <div className='h-[45px] flex items-center gap-2 px-2 border-b shrink-0'>
      <div className='relative flex-1'>
        <Search className='absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none' />
        <Input
          ref={searchInputRef}
          placeholder={`Search... (${isMac ? '⌘' : 'Ctrl'}+K)`}
          className='h-[29px] pl-8'
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <Button
        variant='ghost'
        size='icon'
        className='h-[29px] w-[29px]'
        title={`New Document (${isMac ? '⌘' : 'Ctrl'}+.)`}
        onClick={() => addDocument()}
      >
        <Plus className='h-4 w-4' />
      </Button>
    </div>
  )
}