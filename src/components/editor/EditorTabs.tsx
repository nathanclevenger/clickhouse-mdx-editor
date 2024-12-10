import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MonacoEditor } from './MonacoEditor'
import { MarkdownPreview } from './MarkdownPreview'
import { useEditorStore } from '@/lib/store'
import { useState, useEffect } from 'react'
import { useDebouncedAST } from '@/hooks/use-debounced-ast'
import { useChatStore } from '@/lib/chat/store'

export function EditorTabs() {
  const { selectedDocument } = useEditorStore()
  const isStreaming = useChatStore(state => state.isStreaming)
  const currentChunk = useChatStore(state => state.currentChunk)
  const buffer = useEditorStore(state => state.buffer)
  const [activeTab, setActiveTab] = useState('mdx')
  const mdxContent = selectedDocument?.mdx || ''
  const ast = useDebouncedAST(mdxContent, 100)

  // Switch to preview mode when streaming starts
  useEffect(() => {
    if (isStreaming) {
      setActiveTab('preview')
    }
  }, [isStreaming])

  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="border-b p-2 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <TabsList className="h-8">
            <TabsTrigger value="mdx" className="px-3 h-7" disabled={isStreaming}>MDX</TabsTrigger>
            <TabsTrigger value="ast" className="px-3 h-7" disabled={isStreaming}>AST</TabsTrigger>
            <TabsTrigger value="preview" className="px-3 h-7">Preview</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="truncate max-w-[200px]">
              buffer: {buffer || '<empty>'}
            </div>
            <div className={isStreaming ? 'text-primary animate-pulse' : ''}>
              chunk: {isStreaming ? currentChunk || 'streaming...' : 'idle'}
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsContent value="mdx" className="h-full p-0 m-0 data-[state=inactive]:hidden">
            <MonacoEditor />
          </TabsContent>
          <TabsContent value="ast" className="h-full p-0 m-0 data-[state=inactive]:hidden">
            <MonacoEditor
              value={ast}
              language="json"
              options={{ 
                readOnly: true,
                wordWrap: 'on',
                minimap: { enabled: false }
              }}
            />
          </TabsContent>
          <TabsContent value="preview" className="h-full p-0 m-0 data-[state=inactive]:hidden overflow-auto">
            <MarkdownPreview content={isStreaming ? buffer : mdxContent} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}