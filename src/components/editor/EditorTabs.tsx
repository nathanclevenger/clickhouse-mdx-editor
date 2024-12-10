import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MonacoEditor } from './MonacoEditor'
import { MarkdownPreview } from './MarkdownPreview'
import { useEditorStore } from '@/lib/store'
import { useState } from 'react'
import { useDebouncedAST } from '@/hooks/use-debounced-ast'

export function EditorTabs() {
  const { selectedDocument } = useEditorStore()
  const [activeTab, setActiveTab] = useState('mdx')
  const mdxContent = selectedDocument?.mdx || ''
  const ast = useDebouncedAST(mdxContent, 100) // Updated to 100ms

  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="flex-1">
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
              <MarkdownPreview content={mdxContent} />
            </TabsContent>
          </div>
          <div className="border-t p-2 flex justify-start">
            <TabsList className="h-8">
              <TabsTrigger value="mdx" className="px-3 h-7">MDX</TabsTrigger>
              <TabsTrigger value="ast" className="px-3 h-7">AST</TabsTrigger>
              <TabsTrigger value="preview" className="px-3 h-7">Preview</TabsTrigger>
            </TabsList>
          </div>
        </Tabs>
      </div>
    </div>
  )
}