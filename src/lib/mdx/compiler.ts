import { compile } from '@mdx-js/mdx'
import { defaultPlugins } from './plugins'
import type { CompileOptions } from './types'

export async function compileMDX(content: string, options: CompileOptions = {}) {
  const { format = 'program' } = options

  if (!content?.trim()) {
    return ''
  }

  try {
    const result = await compile(content, {
      outputFormat: format,
      remarkPlugins: defaultPlugins,
      jsx: true,
      providerImportSource: undefined,
    })

    const code = String(result)
    return format === 'function-body' 
      ? `return ${code}`
      : code
  } catch (error) {
    console.error('MDX compilation error:', error)
    throw new Error(`Failed to compile MDX: ${error.message}`)
  }
}