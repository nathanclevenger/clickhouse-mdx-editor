import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMdx from 'remark-mdx'
import { defaultPlugins } from '../plugins'
import { purifyAST } from './purifier'
import type { ASTNode } from './types'

export function getAST(content: string) {
  if (!content?.trim()) {
    return JSON.stringify({ type: 'root', children: [] }, null, 2)
  }

  try {
    const processor = unified()
      .use(remarkParse)
      .use(remarkMdx)
      .use(() => (tree: ASTNode) => {
        // Extract YAML data if present
        const yamlNode = tree.children?.[0]
        if (yamlNode?.type === 'yaml' && yamlNode.data) {
          tree.data = yamlNode.data
          tree.children = tree.children.slice(1)
        }
        return purifyAST(tree)
      })

    defaultPlugins.forEach(plugin => {
      processor.use(plugin)
    })

    const tree = processor.parse(content)
    const transformedTree = processor.runSync(tree)

    return JSON.stringify(transformedTree, null, 2)
  } catch (error) {
    console.error('AST generation error:', error)
    return JSON.stringify({
      type: 'root',
      children: [],
      error: {
        message: error.message,
        name: error.name
      }
    }, null, 2)
  }
}