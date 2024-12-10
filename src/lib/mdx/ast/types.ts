export interface ASTNode {
  type: string
  children?: ASTNode[]
  data?: Record<string, unknown>
  [key: string]: unknown
}

export interface ASTPurifierOptions {
  removePositions?: boolean
  removeInternals?: boolean
  cleanEstree?: boolean
}