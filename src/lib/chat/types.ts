export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export interface ChatState {
  messages: ChatMessage[]
  isStreaming: boolean
}

export interface StreamResult {
  textStream: AsyncIterable<string>
}

export interface ChatError {
  name: string
  message: string
  code: string
  status?: number
  details?: unknown
}

export interface ChatConfig {
  apiKey: string
  model: string
  temperature?: number
  maxTokens?: number
}