import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import Sqids from 'sqids'
import yaml from 'js-yaml'

const sqids = new Sqids()

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSqid(): string {
  return sqids.encode([Date.now()])
}

export function generateFrontmatter(namespace: string) {
  const id = `${namespace}/ideas/${generateSqid()}`
  const type = id.split('/').slice(0, -1).join('/')
  const context = type.split('/').slice(0, -1).join('/')

  return {
    '@context': context,
    '@type': type,
    '@id': id
  }
}

export function createDefaultDocument(frontmatter: Record<string, string>) {
  const spacings: Record<string, number> = {
    '@context': 3,
    '@type': 6,
    '@id': 8
  }

  const yaml = Object.entries(frontmatter)
    .map(([key, value]) => {
      const spaces = ' '.repeat(spacings[key] || 3)
      return `${key}:${spaces}${value}`
    })
    .join('\n')

  return `---
${yaml}
---

# New Document

Start writing...`
}

export function formatMetadata(data: Record<string, unknown>): string {
  // Filter out @ prefixed keys and create new object
  const filteredData = Object.entries(data).reduce((acc, [key, value]) => {
    if (!key.startsWith('@')) {
      acc[key] = value
    }
    return acc
  }, {} as Record<string, unknown>)

  // If no metadata left after filtering, return empty string
  if (Object.keys(filteredData).length === 0) {
    return ''
  }

  // Convert to YAML and clean up
  return yaml.dump(filteredData, {
    indent: 2,
    lineWidth: -1,
    flowLevel: 1,
    noRefs: true
  }).replace(/[{}\n]/g, ' ').trim()
}

export function getDocumentContent(mdx: string): string {
  // Remove YAML frontmatter
  const content = mdx.replace(/^---\n[\s\S]*?\n---\n/, '')
  
  // Get first non-empty line after removing frontmatter and whitespace
  const firstLine = content
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)[0] || ''

  // Remove markdown heading markers and trim
  return firstLine.replace(/^#+\s*/, '').trim()
}