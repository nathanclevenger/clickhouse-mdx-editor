export interface ClickHouseConfig {
  url: string
  username: string
  password: string
  database: string
  dataTable: string
  oplogTable: string
  namespace: string
  openaiApiKey: string
  anthropicApiKey: string
  embeddingModel: string
  embeddingDimensions: number
  chatModel: string
}

export interface Document {
  id: string
  mdx: string
  data: string | Record<string, unknown>
  created?: string
  updated?: string
}

export interface OpLogEntry extends Document {
  timestamp: string
  operation: 'create' | 'update' | 'delete'
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export interface YAMLContent {
  error?: {
    message: string
    name: string
  }
  [key: string]: any
}