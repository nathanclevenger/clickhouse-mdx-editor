import * as runtime from 'react/jsx-runtime'

export async function evaluateMDX(code: string) {
  if (!code?.trim()) {
    return () => null
  }

  try {
    const scope = {
      jsx: runtime.jsx,
      jsxs: runtime.jsxs,
      Fragment: runtime.Fragment
    }
    
    const fn = new Function(...Object.keys(scope), code)
    const Component = fn(...Object.values(scope))
    return typeof Component === 'function' ? Component : () => Component
  } catch (error) {
    console.error('MDX evaluation error:', error)
    throw error
  }
}