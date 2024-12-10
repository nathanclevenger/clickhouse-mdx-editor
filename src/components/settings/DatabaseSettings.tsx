import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import type { ClickHouseConfig } from '@/lib/types'

interface DatabaseSettingsProps {
  formData: ClickHouseConfig
  setFormData: (data: ClickHouseConfig) => void
}

export function DatabaseSettings({ formData, setFormData }: DatabaseSettingsProps) {
  return (
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
      
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
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

      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
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
  )
}