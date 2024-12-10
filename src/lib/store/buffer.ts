import type { Document } from '../types'

export function appendToBuffer(buffer: string, chunk: string): string {
  console.log('Store/Buffer: Appending chunk:', {
    chunk,
    chunkLength: chunk.length,
    currentBufferLength: buffer.length
  })
  
  const newBuffer = buffer + chunk
  console.log('Store/Buffer: Buffer updated:', {
    previousLength: buffer.length,
    newLength: newBuffer.length,
    addedContent: chunk
  })
  
  return newBuffer
}

export function flushBufferToDocument(document: Document, buffer: string): Document {
  console.log('Store/Buffer: Flushing buffer to document:', {
    documentId: document.id,
    bufferLength: buffer.length,
    buffer
  })

  const frontmatterMatch = document.mdx.match(/^---([\s\S]*?)---\n\n/)
  const frontmatter = frontmatterMatch ? frontmatterMatch[0] : ''
  const content = frontmatterMatch 
    ? document.mdx.slice(frontmatterMatch[0].length)
    : document.mdx
  
  const newMdx = `${frontmatter}${content}\n\n${buffer}`
  console.log('Store/Buffer: Created new MDX content:', {
    frontmatterLength: frontmatter.length,
    contentLength: content.length,
    bufferLength: buffer.length,
    totalLength: newMdx.length
  })

  return {
    ...document,
    mdx: newMdx
  }
}