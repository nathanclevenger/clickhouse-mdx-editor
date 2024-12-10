import { Editor, type Monaco } from '@monaco-editor/react'
import { useEditorStore } from '@/lib/store'
import { useEffect, useRef } from 'react'
import type * as monacoEditor from 'monaco-editor'

interface MonacoEditorProps {
  value?: string
  language?: string
  options?: Record<string, unknown>
}

export function MonacoEditor({ value, language = 'markdown', options = {} }: MonacoEditorProps) {
  console.log('MonacoEditor: Rendering', { 
    hasValue: !!value,
    language,
    hasCustomOptions: Object.keys(options).length > 0
  })

  const { selectedDocument, theme, updateSelectedDocument } = useEditorStore()
  const editorValue = value ?? selectedDocument?.mdx ?? ''
  const editorRef = useRef<monacoEditor.editor.IStandaloneCodeEditor>()
  const monacoRef = useRef<Monaco>()

  function handleEditorDidMount(editor: monacoEditor.editor.IStandaloneCodeEditor, monaco: Monaco) {
    editorRef.current = editor
    monacoRef.current = monaco
    console.log('MonacoEditor: Editor mounted')
  }

  // Update editor content directly when value changes
  useEffect(() => {
    if (editorRef.current && editorValue !== editorRef.current.getValue()) {
      console.log('MonacoEditor: Updating editor value directly')
      const position = editorRef.current.getPosition()
      editorRef.current.setValue(editorValue)
      if (position) {
        editorRef.current.setPosition(position)
      }
    }
  }, [editorValue])

  return (
    <div className='h-full'>
      <Editor
        height='100%'
        defaultLanguage={language}
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        value={editorValue}
        onChange={(value) => {
          if (!value || value === editorValue || options.readOnly) {
            console.log('MonacoEditor: Change ignored', {
              noValue: !value,
              unchanged: value === editorValue,
              readOnly: options.readOnly
            })
            return
          }
          console.log('MonacoEditor: Content changed, length:', value.length)
          updateSelectedDocument(value)
        }}
        onMount={handleEditorDidMount}
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