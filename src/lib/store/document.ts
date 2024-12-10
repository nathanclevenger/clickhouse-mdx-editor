import { generateFrontmatter } from '../utils'
import type { Document } from '../types'
import yaml from 'js-yaml'

export function createDocument(namespace: string, document?: Partial<Document>): Document {
  console.log('Store/Document: Creating new document')
  // Use the fixed generateFrontmatter function
  const frontmatter = generateFrontmatter(namespace)
  console.log('Store/Document: Generated frontmatter:', frontmatter)
  
  const mdx = `---
_id: ${frontmatter._id}
---

# 
`
  const now = new Date().toISOString()
  
  const newDocument = {
    id: frontmatter._id,
    mdx,
    data: JSON.stringify(frontmatter),
    created: now,
    updated: now,
    ...document
  }

  console.log('Store/Document: Created document:', {
    id: newDocument.id,
    frontmatter
  })

  return newDocument
}

export function updateDocument(document: Document): Document {
  console.log('Store/Document: Updating document:', document.id)
  const frontmatter = yaml.load(document.mdx.match(/^---([\s\S]*?)---/)?.[1] || '') as Record<string, unknown>
  
  return {
    ...document,
    data: JSON.stringify(frontmatter),
    updated: new Date().toISOString(),
    id: (frontmatter._id as string) || document.id
  }
}