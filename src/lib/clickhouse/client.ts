import { ClickHouseConfig } from '../types'

export async function executeQuery(config: ClickHouseConfig, query: string): Promise<any> {
  try {
    // Format query parameters
    const params = new URLSearchParams({
      query,
      default_format: 'JSONCompact'
    })

    const response = await fetch(`${config.url}/?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${btoa(`${config.username}:${config.password}`)}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`ClickHouse error: ${errorText}`)
    }

    const text = await response.text()
    
    if (!text.trim()) {
      return { data: [] }
    }

    try {
      return { data: JSON.parse(text) }
    } catch (e) {
      if (text.includes('Authentication failed')) {
        throw new Error('Authentication failed. Please check your credentials.')
      }
      if (text.includes('Connection refused')) {
        throw new Error('Connection refused. Please check if ClickHouse is running.')
      }
      throw new Error(`Failed to parse response: ${text}`)
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Could not connect to ClickHouse. Please check the URL and ensure the server is running.')
      }
      throw error
    }
    throw new Error('An unexpected error occurred')
  }
}