import * as React from 'react'
import * as runtime from 'react/jsx-runtime'

const defaultComponents = {
  h1: (props: any) => runtime.jsx('h1', { ...props, className: 'text-3xl font-bold mb-4' }),
  h2: (props: any) => runtime.jsx('h2', { ...props, className: 'text-2xl font-bold mb-3' }),
  h3: (props: any) => runtime.jsx('h3', { ...props, className: 'text-xl font-bold mb-2' }),
  p: (props: any) => runtime.jsx('p', { ...props, className: 'mb-4 leading-7' }),
  ul: (props: any) => runtime.jsx('ul', { ...props, className: 'list-disc pl-5 mb-4 space-y-2' }),
  ol: (props: any) => runtime.jsx('ol', { ...props, className: 'list-decimal pl-5 mb-4 space-y-2' }),
  li: (props: any) => runtime.jsx('li', { ...props, className: 'mb-1' }),
  blockquote: (props: any) => runtime.jsx('blockquote', { 
    ...props, 
    className: 'border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-4' 
  }),
  code: (props: any) => runtime.jsx('code', { 
    ...props, 
    className: 'bg-gray-100 dark:bg-gray-800 rounded px-1.5 py-0.5 text-sm font-mono' 
  }),
  pre: (props: any) => runtime.jsx('pre', { 
    ...props, 
    className: 'bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4 overflow-x-auto font-mono text-sm' 
  }),
  a: (props: any) => runtime.jsx('a', {
    ...props,
    className: 'text-blue-600 dark:text-blue-400 hover:underline',
    target: '_blank',
    rel: 'noopener noreferrer'
  }),
  hr: (props: any) => runtime.jsx('hr', {
    ...props,
    className: 'my-8 border-t border-gray-200 dark:border-gray-700'
  }),
  img: (props: any) => runtime.jsx('img', {
    ...props,
    className: 'max-w-full h-auto rounded-lg my-4'
  }),
  table: (props: any) => runtime.jsx('table', {
    ...props,
    className: 'min-w-full my-4 border-collapse'
  }),
  th: (props: any) => runtime.jsx('th', {
    ...props,
    className: 'border border-gray-200 dark:border-gray-700 px-4 py-2 bg-gray-50 dark:bg-gray-800'
  }),
  td: (props: any) => runtime.jsx('td', {
    ...props,
    className: 'border border-gray-200 dark:border-gray-700 px-4 py-2'
  })
}

export function createMDXScope() {
  return {
    React,
    Fragment: React.Fragment,
    jsx: runtime.jsx,
    jsxs: runtime.jsxs,
    components: defaultComponents,
    ...defaultComponents
  }
}

export async function evaluateMDX(code: string) {
  if (!code?.trim()) {
    return () => null
  }

  try {
    const scope = createMDXScope()
    const fn = new Function(...Object.keys(scope), `${code}`)
    const Component = fn(...Object.values(scope))
    return typeof Component === 'function' ? Component : () => Component
  } catch (error) {
    console.error('MDX evaluation error:', error)
    throw error
  }
}