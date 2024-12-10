import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMdx from 'remark-mdx'
import { defaultPlugins } from '../plugins'
import { purifyAST } from './purifier'
import type { ASTNode } from './types'

export function getAST(content: string) {
  const startTime = performance.now()

  if (!content?.trim()) {
    console.log('AST: Empty content, returning empty tree')
    return JSON.stringify({ type: 'root', children: [] }, null, 2)
  }

  try {
    const parseStartTime = performance.now()
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
    const parseEndTime = performance.now()
    const parseTime = parseEndTime - parseStartTime

    const transformStartTime = performance.now()
    const transformedTree = processor.runSync(tree)
    const transformEndTime = performance.now()
    const transformTime = transformEndTime - transformStartTime

    const stringifyStartTime = performance.now()
    const result = JSON.stringify(transformedTree, null, 2)
    const stringifyEndTime = performance.now()
    const stringifyTime = stringifyEndTime - stringifyStartTime

    const totalTime = performance.now() - startTime

    console.log('AST Performance:', {
      contentLength: content.length,
      parseTime: parseTime.toFixed(2) + 'ms',
      transformTime: transformTime.toFixed(2) + 'ms',
      stringifyTime: stringifyTime.toFixed(2) + 'ms',
      totalTime: totalTime.toFixed(2) + 'ms'
    })

    return result
  } catch (error) {
    const errorTime = performance.now() - startTime
    console.error('AST generation error:', error, `(${errorTime.toFixed(2)}ms)`)
    return JSON.stringify({
      type: 'root',
      children: [],
      error: {
        message: error.message,
        name: error.name,
        time: errorTime.toFixed(2) + 'ms'
      }
    }, null, 2)
  }
}