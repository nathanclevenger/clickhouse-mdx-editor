import { Editor } from '@monaco-editor/react'
import { useEditorStore } from '@/lib/store'

interface MonacoEditorProps {
  value?: string
  language?: string
  options?: Record<string, unknown>
}

export function MonacoEditor({ value, language = 'markdown', options = {} }: MonacoEditorProps) {
  const { selectedDocument, theme, updateSelectedDocument } = useEditorStore()
  const editorValue = value ?? selectedDocument?.mdx ?? ''

  return (
    <div className='h-full'>
      <Editor
        height='100%'
        defaultLanguage={language}
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        value={editorValue}
        onChange={(value) => {
          if (!value || value === editorValue || options.readOnly) return
          updateSelectedDocument(value)
        }}
        options={{
          minimap: { enabled: false },
          wordWrap: 'on',
          lineNumbers: 'on',
          fontSize: 14,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 24, bottom: 24 },
          folding: false,
          glyphMargin: false,
          lineDecorationsWidth: 24,
          lineNumbersMinChars: 3,
          renderLineHighlight: 'none',
          contextmenu: false,
          overviewRulerBorder: false,
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          scrollbar: {
            vertical: 'visible',
            horizontal: 'hidden',
            verticalScrollbarSize: 12,
            horizontalScrollbarSize: 0,
          },
          ...options
        }}
        loading={<div className='flex items-center justify-center h-full text-muted-foreground'>Loading editor...</div>}
      />
    </div>
  )
}