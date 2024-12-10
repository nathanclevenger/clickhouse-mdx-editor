import { useEffect } from 'react'
import { useEditorStore } from '@/lib/store'
import { ConfigForm } from '@/components/ConfigForm'
import { Editor } from '@/components/Editor'
import { ThemeProvider } from '@/components/ThemeProvider'
import { KeyboardShortcuts } from '@/components/KeyboardShortcuts'
import type { ClickHouseConfig } from '@/lib/types'

function App() {
  const { config, setConfig } = useEditorStore()

  useEffect(() => {
    const savedConfig = localStorage.getItem('clickhouse-config')
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig) as ClickHouseConfig)
    }
  }, [setConfig])

  return (
    <ThemeProvider>
      <KeyboardShortcuts />
      {!config ? <ConfigForm /> : <Editor />}
    </ThemeProvider>
  )
}

export default App