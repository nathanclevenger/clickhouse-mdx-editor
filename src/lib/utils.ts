import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import Sqids from 'sqids'
import yaml from 'js-yaml'

const sqids = new Sqids()

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSqid(): string {
  const sqid = sqids.encode([Date.now()])
  console.log('Utils: Generated new sqid:', sqid)
  return sqid
}

export function generateFrontmatter(namespace: string) {
  console.log('Utils: Generating frontmatter for namespace:', namespace)
  const id = `${namespace}/ideas/${generateSqid()}`
  const frontmatter = { _id: id }
  console.log('Utils: Generated frontmatter:', frontmatter)
  return frontmatter
}

export function createDefaultDocument(frontmatter: Record<string, string>) {
  console.log('Utils: Creating default document with frontmatter:', frontmatter)
  const spacings: Record<string, number> = {
    _id: 1
  }

  const yaml = Object.entries(frontmatter)
    .map(([key, value]) => {
      const spaces = ' '.repeat(spacings[key] || 3)
      return `${key}:${spaces}${value}`
    })
    .join('\n')

  const document = `---
${yaml}
---

# 

`
  console.log('Utils: Created default document:', document)
  return document
}

export function formatMetadata(data: Record<string, unknown>): string {
  console.log('Utils: Formatting metadata')
  // Filter out underscore prefixed keys and create new object
  const filteredData = Object.entries(data).reduce((acc, [key, value]) => {
    if (!key.startsWith('_')) {
      acc[key] = value
    }
    return acc
  }, {} as Record<string, unknown>)

  // If no metadata left after filtering, return empty string
  if (Object.keys(filteredData).length === 0) {
    return ''
  }

  // Convert to YAML and clean up
  const formatted = yaml.dump(filteredData, {
    indent: 2,
    lineWidth: -1,
    flowLevel: 1,
    noRefs: true
  }).replace(/[{}\n]/g, ' ').trim()

  console.log('Utils: Formatted metadata result:', formatted)
  return formatted
}

export function getDocumentContent(mdx: string): string {
  console.log('Utils: Getting document content')
  // Remove YAML frontmatter
  const content = mdx.replace(/^---\n[\s\S]*?\n---\n/, '')
  
  // Get first non-empty line after removing frontmatter and whitespace
  const firstLine = content
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)[0] || ''

  // Remove markdown heading markers and trim
  const result = firstLine.replace(/^#+\s*/, '').trim()
  console.log('Utils: Document content result:', result)
  return result
}