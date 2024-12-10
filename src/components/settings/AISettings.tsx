import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import type { ClickHouseConfig } from '@/lib/types'

interface AISettingsProps {
  formData: ClickHouseConfig
  setFormData: (data: ClickHouseConfig) => void
}

export function AISettings({ formData, setFormData }: AISettingsProps) {
  return (
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
  )
}