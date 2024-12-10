import * as runtime from 'react/jsx-runtime'

export function createScope() {
  return {
    jsx: runtime.jsx,
    jsxs: runtime.jsxs,
    Fragment: runtime.Fragment
  }
}