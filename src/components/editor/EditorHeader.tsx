import { Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEditorStore } from '@/lib/store'
import { useHotkeys } from '@/hooks/use-hotkeys'

export function EditorHeader() {
  const { selectedDocument, saveDocument } = useEditorStore()
  const documentData = selectedDocument ? JSON.parse(selectedDocument.data) : null

  const handleSave = () => {
    if (selectedDocument) {
      saveDocument(selectedDocument)
    }
  }

  useHotkeys('shift+return', handleSave)

  return (
    <div className='flex h-[45px] items-center justify-between border-b px-2'>
      {documentData?._id ? (
        <a
          href={documentData._id}
          target='_blank'
          rel='noopener noreferrer'
          className='text-sm hover:underline text-muted-foreground'
        >
          {documentData._id}
        </a>
      ) : (
        <div />
      )}
      <Button
        variant='ghost'
        size='sm'
        className='h-8'
        onClick={handleSave}
        disabled={!selectedDocument}
      >
        <Save className='h-4 w-4 mr-2' />
        Save
      </Button>
    </div>
  )
}