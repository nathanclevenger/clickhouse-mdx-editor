export interface CompileOptions {
  format?: 'program' | 'function-body'
  development?: boolean
  plugins?: any[]
}

export interface ASTNode {
  type: string
  [key: string]: any
}

export interface ASTPurifierOptions {
  removePositions?: boolean
  removeInternals?: boolean
  cleanEstree?: boolean
}

export type YAMLContent = Record<string, unknown> | {
  error: {
    message: string
    name: string
  }
}