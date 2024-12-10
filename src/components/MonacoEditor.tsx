import { Editor } from '@monaco-editor/react'
import { useEditorStore } from '@/lib/store'

export function MonacoEditor() {
  const { selectedDocument, theme } = useEditorStore()

  return (
    <div className='h-full'>
      <Editor
        height='100%'
        defaultLanguage='markdown'
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        value={selectedDocument?.mdx || ''}
        options={{
          minimap: { enabled: false },
          wordWrap: 'on',
          lineNumbers: 'on',
          fontSize: 14,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 16, bottom: 16 },
        }}
        loading={<div className='flex items-center justify-center h-full text-muted-foreground'>Loading editor...</div>}
      />
    </div>
  )
}