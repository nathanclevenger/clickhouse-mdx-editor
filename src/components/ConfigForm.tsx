import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEditorStore } from '@/lib/store'
import { Editor } from './Editor'
import { DatabaseSettings } from './settings/DatabaseSettings'
import { AISettings } from './settings/AISettings'
import type { ClickHouseConfig } from '@/lib/types'

const DEFAULT_CONFIG: ClickHouseConfig = {
  url: 'http://localhost:8123',
  username: 'default',
  password: '',
  database: 'default',
  dataTable: 'data',
  oplogTable: 'oplog',
  namespace: 'https://example.com',
  openaiApiKey: '',
  embeddingModel: 'text-embedding-3-large',
  embeddingDimensions: 256,
  chatModel: 'gpt-4',
}

interface ConfigFormProps {
  isDialog?: boolean
  autoFocusField?: keyof ClickHouseConfig
  onClose?: () => void
}

export function ConfigForm({ isDialog = false, autoFocusField, onClose }: ConfigFormProps) {
  const { config, setConfig } = useEditorStore()
  const [formData, setFormData] = useState<ClickHouseConfig>({
    ...DEFAULT_CONFIG,
    ...config,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<string>(autoFocusField?.includes('Api') ? 'ai' : 'db')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted && autoFocusField) {
      const timeoutId = setTimeout(() => {
        const input = document.getElementById(autoFocusField) as HTMLInputElement
        if (input) {
          input.focus()
        }
      }, 50)
      return () => clearTimeout(timeoutId)
    }
  }, [autoFocusField, isMounted])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      localStorage.setItem('clickhouse-config', JSON.stringify(formData))
      setConfig(formData)
      if (onClose) {
        onClose()
      }
    } catch (error) {
      console.error('Failed to save config:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const form = (
    <form onSubmit={handleSubmit}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="db">DB</TabsTrigger>
          <TabsTrigger value="ai">AI</TabsTrigger>
        </TabsList>
        
        <TabsContent value="db">
          <DatabaseSettings formData={formData} setFormData={setFormData} />
        </TabsContent>

        <TabsContent value="ai">
          <AISettings formData={formData} setFormData={setFormData} />
        </TabsContent>
      </Tabs>

      <Button type='submit' className='w-full mt-6' disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Settings'}
      </Button>
    </form>
  )

  if (isDialog) {
    return form
  }

  return (
    <div className='min-h-screen bg-background'>
      <div className='fixed inset-0 bg-background/80 backdrop-blur-sm' />
      <Dialog open={true}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>MDX Editor Configuration</DialogTitle>
            <DialogDescription>
              Enter your configuration details to get started with the MDX editor.
            </DialogDescription>
          </DialogHeader>
          {form}
        </DialogContent>
      </Dialog>
      <div className='opacity-50'>
        <Editor />
      </div>
    </div>
  )
}