import { useEditorStore } from '@/lib/store'
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcut'

export function KeyboardShortcuts() {
  const { 
    setActiveTab, 
    focusSearchInput, 
    focusChatInput, 
    activeTab,
    addDocument,
    resetChat
  } = useEditorStore()

  useKeyboardShortcut('k', () => {
    setActiveTab('db')
    setTimeout(focusSearchInput, 0)
  })

  useKeyboardShortcut('l', () => {
    setActiveTab('ai')
    setTimeout(focusChatInput, 0)
  })

  useKeyboardShortcut('.', () => {
    if (activeTab === 'db') {
      addDocument()
    } else {
      resetChat()
      setTimeout(focusChatInput, 0)
    }
  })

  return null
}