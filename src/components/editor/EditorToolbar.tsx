import { Button } from '@/components/ui/button'
import { useEditorStore } from '@/lib/store'
import { Moon, Sun } from 'lucide-react'

export function EditorToolbar() {
  const { theme, setTheme } = useEditorStore()

  return (
    <div className='border-b p-2 flex justify-end'>
      <Button
        variant='ghost'
        size='icon'
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </Button>
    </div>
  )
}