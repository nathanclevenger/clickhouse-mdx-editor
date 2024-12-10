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
    Object.keys(newNode).forEach(key => {
      if (key.startsWith('_')) {
        delete newNode[key]
      }
    })
  }

  if (newNode.data) {
    const cleanedData = { ...newNode.data }
    
    Object.keys(cleanedData).forEach(key => {
      if (key.startsWith('_')) {
        delete cleanedData[key]
      }
    })

    if (cleanEstree && cleanedData.estree) {
      cleanedData.estree = cleanEstreeNode(cleanedData.estree)
    }
    
    if (Object.keys(cleanedData).length > 0) {
      newNode.data = cleanedData
    } else {
      delete newNode.data
    }
  }

  if (Array.isArray(newNode.children)) {
    newNode.children = newNode.children.map(child => purifyNode(child, options))
  }

  return newNode
}

export function purifyAST(tree: ASTNode, options?: ASTPurifierOptions) {
  return purifyNode(tree, options)
}