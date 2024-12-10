import { useEffect, useRef } from 'react'

interface Options {
  ctrlKey?: boolean
  metaKey?: boolean
  altKey?: boolean
  shiftKey?: boolean
}

export function useKeyboardShortcut(
  key: string, 
  callback: () => void, 
  options: Options = {}
) {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
      const cmdOrCtrlPressed = isMac ? event.metaKey : event.ctrlKey

      // Check if we're in a text input or textarea, but allow our specific shortcuts
      const isInput = event.target instanceof HTMLElement && 
        (event.target.tagName === 'INPUT' || 
         event.target.tagName === 'TEXTAREA' ||
         event.target.getAttribute('role') === 'textbox' ||
         event.target.getAttribute('contenteditable') === 'true')

      // Always prevent default for our specific keyboard shortcuts
      if (
        event.key.toLowerCase() === key.toLowerCase() &&
        cmdOrCtrlPressed === true &&
        event.altKey === !!options.altKey &&
        event.shiftKey === !!options.shiftKey
      ) {
        // Prevent default before doing anything else
        event.preventDefault()
        event.stopPropagation()
        
        // Execute the callback
        callbackRef.current()
        
        // Return false to ensure the event is completely handled
        return false
      }
    }

    // Use capture phase to ensure we get the event before other handlers
    window.addEventListener('keydown', handler, true)
    return () => window.removeEventListener('keydown', handler, true)
  }, [key, options])
}