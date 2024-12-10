import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { LeftPanel } from '@/components/editor/LeftPanel'
import { EditorHeader } from '@/components/editor/EditorHeader'
import { EditorTabs } from '@/components/editor/EditorTabs'
import { StreamingIndicator } from './StreamingIndicator'

export function EditorLayout() {
  return (
    <div className='h-screen w-screen flex flex-col bg-background'>
      <ResizablePanelGroup direction='horizontal' className='flex-1'>
        <ResizablePanel defaultSize={33} minSize={20} maxSize={80}>
          <LeftPanel />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={67} minSize={20}>
          <div className='h-full flex flex-col'>
            <EditorHeader />
            <div className='flex-1 relative'>
              <EditorTabs />
            </div>
            <div className="border-t p-2 flex justify-between items-center">
              <div></div>
              <StreamingIndicator />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}