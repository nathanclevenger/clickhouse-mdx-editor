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

// Custom YAML type for handling underscore prefixed tags
const underscoreType = new yaml.Type('!_', {
  kind: 'scalar',
  resolve: (data: string) => typeof data === 'string',
  construct: (data: string) => data,
  represent: (data: string) => data
})

// Custom schema that includes our new type
const UNDERSCORE_SCHEMA = yaml.DEFAULT_SCHEMA.extend([underscoreType])

function preserveUnderscores(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj

  const result: Record<string, any> = {}
  
  for (const [key, value] of Object.entries(obj)) {
    result[key] = typeof value === 'object' ? preserveUnderscores(value) : value
  }

  return result
}

export const remarkParseYaml: Plugin = () => {
  return (tree) => {
    visit(tree, 'yaml', (node: YAMLNode) => {
      try {
        // Parse with custom schema
        const parsedValue = yaml.load(node.value, {
          schema: UNDERSCORE_SCHEMA
        })

        // Set parsed data
        node.data = preserveUnderscores(parsedValue)
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