import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEditorStore } from '@/lib/store'

export function ThemeToggle() {
  const { theme, setTheme } = useEditorStore()

  return (
    <Button
      variant='ghost'
      size='sm'
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
    </Button>
  )
}