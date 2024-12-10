import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEditorStore } from '@/lib/store'
import { Editor } from './Editor'
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
  anthropicApiKey: '',
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
        
        <TabsContent value="db" className="space-y-4">
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='url'>ClickHouse URL</Label>
              <Input
                id='url'
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder='http://localhost:8123'
                required
              />
            </div>
            
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='username'>Username</Label>
                <Input
                  id='username'
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder='default'
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='password'>Password</Label>
                <Input
                  id='password'
                  type='password'
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder='Leave empty for default installation'
                />
              </div>
            </div>

            <div className='grid grid-cols-3 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='database'>Database</Label>
                <Input
                  id='database'
                  value={formData.database}
                  onChange={(e) => setFormData({ ...formData, database: e.target.value })}
                  placeholder='mdx_docs'
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='dataTable'>Data</Label>
                <Input
                  id='dataTable'
                  value={formData.dataTable}
                  onChange={(e) => setFormData({ ...formData, dataTable: e.target.value })}
                  placeholder='data'
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='oplogTable'>OpLog</Label>
                <Input
                  id='oplogTable'
                  value={formData.oplogTable}
                  onChange={(e) => setFormData({ ...formData, oplogTable: e.target.value })}
                  placeholder='oplog'
                  required
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='namespace'>Namespace URI</Label>
              <Input
                id='namespace'
                value={formData.namespace}
                onChange={(e) => setFormData({ ...formData, namespace: e.target.value })}
                placeholder='https://example.com/'
                required
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='openaiApiKey'>OpenAI API Key</Label>
              <Input
                id='openaiApiKey'
                type='password'
                value={formData.openaiApiKey}
                onChange={(e) => setFormData({ ...formData, openaiApiKey: e.target.value })}
                placeholder='sk-...'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='anthropicApiKey'>Anthropic API Key</Label>
              <Input
                id='anthropicApiKey'
                type='password'
                value={formData.anthropicApiKey}
                onChange={(e) => setFormData({ ...formData, anthropicApiKey: e.target.value })}
                placeholder='sk-ant-...'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='embeddingModel'>Embedding Model</Label>
              <Input
                id='embeddingModel'
                value={formData.embeddingModel}
                onChange={(e) => setFormData({ ...formData, embeddingModel: e.target.value })}
                placeholder='text-embedding-3-large'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='embeddingDimensions'>Embedding Dimensions</Label>
              <Input
                id='embeddingDimensions'
                type='number'
                value={formData.embeddingDimensions}
                onChange={(e) => setFormData({ ...formData, embeddingDimensions: parseInt(e.target.value, 10) })}
                placeholder='256'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='chatModel'>Chat Model</Label>
              <Input
                id='chatModel'
                value={formData.chatModel}
                onChange={(e) => setFormData({ ...formData, chatModel: e.target.value })}
                placeholder='gpt-4'
              />
            </div>
          </div>
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