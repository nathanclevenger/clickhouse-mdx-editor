import { ChatError } from './types'

export class ChatAPIError extends Error implements ChatError {
  constructor(
    message: string,
    public code: string,
    public status?: number,
    public details?: unknown
  ) {
    super(message)
    this.name = 'ChatAPIError'
  }
}

export class ChatStreamError extends Error implements ChatError {
  constructor(
    message: string,
    public code: string,
    public status?: number,
    public details?: unknown
  ) {
    super(message)
    this.name = 'ChatStreamError'
  }
}

export class ChatConfigError extends Error implements ChatError {
  constructor(message: string) {
    super(message)
    this.name = 'ChatConfigError'
    this.code = 'CONFIG_ERROR'
  }
}