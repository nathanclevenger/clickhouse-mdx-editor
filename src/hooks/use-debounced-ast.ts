import { useState, useEffect } from 'react'
import { getAST } from '@/lib/mdx'

export function useDebouncedAST(content: string, delay: number = 500) {
  const [ast, setAst] = useState<string>('')

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const newAst = getAST(content)
        setAst(newAst)
      } catch (error) {
        console.error('AST generation error:', error)
        setAst(JSON.stringify({
          type: 'root',
          children: [],
          error: {
            message: error.message,
            name: error.name
          }
        }, null, 2))
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [content, delay])

  return ast
}