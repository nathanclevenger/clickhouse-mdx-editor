import { useState, useCallback, useEffect } from 'react'
import { getAST } from '@/lib/mdx'
import { useDebounce } from './use-debounce'

export function useDebouncedAST(content: string, delay: number = 500) {
  const [ast, setAst] = useState<string>('')

  const generateAST = useCallback(async (content: string) => {
    const startTime = performance.now()
    console.log('AST: Starting generation for content length:', content.length)
    
    try {
      const newAst = getAST(content)
      const totalTime = performance.now() - startTime
      console.log('AST: Generation completed', {
        contentLength: content.length,
        astLength: newAst.length,
        totalTime: totalTime.toFixed(2) + 'ms'
      })
      setAst(newAst)
    } catch (error) {
      const errorTime = performance.now() - startTime
      console.error('AST: Generation error:', {
        error,
        time: errorTime.toFixed(2) + 'ms'
      })
      setAst(JSON.stringify({
        type: 'root',
        children: [],
        error: {
          message: error.message,
          name: error.name,
          time: errorTime.toFixed(2) + 'ms'
        }
      }, null, 2))
    }
  }, [])

  const debouncedGenerateAST = useDebounce(generateAST, delay)

  useEffect(() => {
    console.log('AST: Content changed, debouncing generation')
    debouncedGenerateAST(content)
  }, [content, debouncedGenerateAST])

  return ast
}