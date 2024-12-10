import OpenAI from 'openai'
import type { ChatConfig } from './types'
import { ChatAPIError, ChatConfigError, ChatStreamError } from './errors'
import { getSystemMessage } from './system-message'

export async function streamChatResponse(
  message: string,
  config: ChatConfig,
  onChunk: (chunk: string) => void
): Promise<void> {
  if (!config.apiKey) {
    throw new ChatConfigError('API key is required')
  }

  console.log('OpenAI: Initializing client')
  const openai = new OpenAI({
    apiKey: config.apiKey,
    dangerouslyAllowBrowser: true
  })

  try {
    console.log('OpenAI: Creating chat completion stream')
    const stream = await openai.chat.completions.create({
      model: config.model || 'gpt-4',
      messages: [
        { role: 'system', content: getSystemMessage() },
        { role: 'user', content: message }
      ],
      stream: true,
      temperature: config.temperature ?? 0.7,
      max_tokens: config.maxTokens ?? 1000,
    })

    console.log('OpenAI: Stream created, starting iteration')
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content
      if (content) {
        console.log('OpenAI: Processing content chunk:', content)
        onChunk(content)
      }
    }
    console.log('OpenAI: Stream completed')
  } catch (error) {
    console.error('OpenAI: Stream error:', error)
    if (error.code === 'invalid_api_key') {
      throw new ChatConfigError('Invalid API key')
    }

    if (error.status) {
      throw new ChatAPIError(
        error.message || 'API request failed',
        'API_ERROR',
        error.status,
        error.response?.data
      )
    }

    if (error.name === 'AbortError') {
      throw new ChatStreamError('Stream was aborted', 'STREAM_ABORTED')
    }

    throw new ChatStreamError(
      'Failed to stream response',
      'STREAM_ERROR',
      undefined,
      error
    )
  }
}