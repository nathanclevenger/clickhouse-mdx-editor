import { createScope } from './scope'

export async function evaluateMDX(code: string) {
  if (!code?.trim()) {
    return () => null
  }

  try {
    const scope = createScope()
    const fn = new Function(...Object.keys(scope), code)
    const Component = fn(...Object.values(scope))
    return typeof Component === 'function' ? Component : () => Component
  } catch (error) {
    console.error('MDX evaluation error:', error)
    throw error
  }
}