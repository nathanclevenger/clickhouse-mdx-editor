import yaml from 'js-yaml'
import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Node } from 'unist'
import type { YAMLContent } from './types'

interface YAMLNode extends Node {
  type: 'yaml'
  value: string
  data?: YAMLContent
}

// Custom YAML type for handling @ prefixed tags
const atSymbolType = new yaml.Type('!@', {
  kind: 'scalar',
  resolve: (data: string) => typeof data === 'string',
  construct: (data: string) => data,
  represent: (data: string) => data
})

// Custom schema that includes our new type
const AT_SYMBOL_SCHEMA = yaml.DEFAULT_SCHEMA.extend([atSymbolType])

function preserveAtSymbols(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj

  const result: Record<string, any> = {}
  
  for (const [key, value] of Object.entries(obj)) {
    // Add back the @ symbol to the key
    const newKey = key.startsWith('_at_') ? `@${key.slice(4)}` : key
    result[newKey] = typeof value === 'object' ? preserveAtSymbols(value) : value
  }

  return result
}

function preprocessYaml(content: string): string {
  // Replace @ with _at_ in keys to allow parsing
  return content
    .split('\n')
    .map(line => {
      const trimmed = line.trim()
      if (trimmed.startsWith('@')) {
        return '_at_' + trimmed.substring(1)
      }
      return line
    })
    .join('\n')
}

export const remarkParseYaml: Plugin = () => {
  return (tree) => {
    visit(tree, 'yaml', (node: YAMLNode) => {
      try {
        // Preprocess the YAML content
        const preprocessed = preprocessYaml(node.value)
        
        // Parse with custom schema
        const parsedValue = yaml.load(preprocessed, {
          schema: AT_SYMBOL_SCHEMA
        })

        // Restore @ symbols in keys and set as data
        node.data = preserveAtSymbols(parsedValue)
      } catch (error) {
        console.error('YAML parsing error:', error)
        node.data = {
          error: {
            message: error.message,
            name: error.name
          }
        }
      }
    })
  }
}