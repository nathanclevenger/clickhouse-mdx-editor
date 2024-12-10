import { visit } from 'unist-util-visit'
import type { ASTNode, ASTPurifierOptions } from './types'

function cleanEstreeNode(node: any) {
  if (!node || typeof node !== 'object') return node

  const newNode = { ...node }
  delete newNode.start
  delete newNode.end
  delete newNode.loc
  delete newNode.range
  delete newNode.comments
  delete newNode.tokens

  // Recursively clean properties
  Object.keys(newNode).forEach(key => {
    if (typeof newNode[key] === 'object') {
      newNode[key] = cleanEstreeNode(newNode[key])
    }
  })

  return newNode
}

export function purifyNode(node: ASTNode, options: ASTPurifierOptions = {}) {
  const { removePositions = true, removeInternals = true, cleanEstree = true } = options
  const newNode = { ...node }

  if (removePositions) {
    delete newNode.position
    delete newNode.start
    delete newNode.end
    delete newNode.loc
    delete newNode.range
  }

  if (removeInternals) {
    // Remove internal properties (prefixed with _)
    Object.keys(newNode).forEach(key => {
      if (key.startsWith('_')) {
        delete newNode[key]
      }
    })
  }

  // Clean data property if it exists
  if (newNode.data) {
    const cleanedData = { ...newNode.data }
    
    // Clean internal properties
    Object.keys(cleanedData).forEach(key => {
      if (key.startsWith('_')) {
        delete cleanedData[key]
      }
    })

    // Clean estree if present
    if (cleanEstree && cleanedData.estree) {
      cleanedData.estree = cleanEstreeNode(cleanedData.estree)
    }
    
    // Only keep data if it has remaining properties
    if (Object.keys(cleanedData).length > 0) {
      newNode.data = cleanedData
    } else {
      delete newNode.data
    }
  }

  // Handle children recursively
  if (Array.isArray(newNode.children)) {
    newNode.children = newNode.children.map(child => purifyNode(child, options))
  }

  return newNode
}

export function purifyAST(tree: ASTNode, options?: ASTPurifierOptions) {
  return purifyNode(tree, options)
}