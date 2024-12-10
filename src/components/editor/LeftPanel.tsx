import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DocumentList } from './DocumentList'
import { ChatView } from './ChatView'
import { Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ConfigForm } from '../ConfigForm'
import { ThemeToggle } from './ThemeToggle'
import { useEditorStore } from '@/lib/store'
import { SearchHeader } from './SearchHeader'

export function LeftPanel() {
  const { activeTab, setActiveTab } = useEditorStore()

  return (
    <div className='h-full flex flex-col'>
      <SearchHeader />
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className='flex-1 flex flex-col min-h-0'
      >
        <div className='flex-1 min-h-0 relative'>
          <TabsContent 
            value='db' 
            className='absolute inset-0 data-[state=inactive]:hidden'
          >
            <DocumentList />
          </TabsContent>
          
          <TabsContent 
            value='ai' 
            className='absolute inset-0 data-[state=inactive]:hidden'
          >
            <ChatView />
          </TabsContent>
        </div>

        <div className='border-t bg-background p-2 flex justify-between items-center shrink-0 relative z-10'>
          <TabsList className='h-8'>
            <TabsTrigger value='db' className='px-3 h-7'>DB</TabsTrigger>
            <TabsTrigger value='ai' className='px-3 h-7'>AI</TabsTrigger>
          </TabsList>
          <div className='flex items-center gap-2'>
            <ThemeToggle />
            <Dialog>
              <DialogTrigger asChild>
                <Button variant='ghost' size='icon' className='h-8 w-8'>
                  <Settings size={16} />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Settings</DialogTitle>
                </DialogHeader>
                <ConfigForm isDialog />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Tabs>
    </div>
  )
}