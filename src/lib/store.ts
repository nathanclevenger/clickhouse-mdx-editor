import { create } from 'zustand'
import { ClickHouseConfig, Document, Message } from './types'
import { generateFrontmatter, createDefaultDocument } from './utils'
import yaml from 'js-yaml'

interface EditorStore {
  config: ClickHouseConfig | null
  setConfig: (config: ClickHouseConfig) => void
  documents: Document[]
  setDocuments: (documents: Document[]) => void
  selectedDocument: Document | null
  setSelectedDocument: (document: Document | null) => void
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  addDocument: (document?: Partial<Document>) => void
  saveDocument: (document: Document) => void
  updateSelectedDocument: (mdx: string) => void
  activeTab: 'db' | 'ai'
  setActiveTab: (tab: 'db' | 'ai') => void
  searchInputRef: React.RefObject<HTMLInputElement> | null
  setSearchInputRef: (ref: React.RefObject<HTMLInputElement>) => void
  chatInputRef: React.RefObject<HTMLTextAreaElement> | null
  setChatInputRef: (ref: React.RefObject<HTMLTextAreaElement>) => void
  focusSearchInput: () => void
  focusChatInput: () => void
  messages: Message[]
  setMessages: (messages: Message[]) => void
  resetChat: () => void
}

function extractFrontmatter(mdx: string): Record<string, unknown> {
  try {
    const match = mdx.match(/^---\n([\s\S]*?)\n---/)
    if (match) {
      return yaml.load(match[1]) as Record<string, unknown>
    }
  } catch (e) {
    console.error('Failed to parse frontmatter:', e)
  }
  return {}
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  config: null,
  setConfig: (config) => {
    set({ config })
    localStorage.setItem('clickhouse-config', JSON.stringify(config))
  },
  documents: [],
  setDocuments: (documents) => {
    set({ documents })
    localStorage.setItem('documents', JSON.stringify(documents))
  },
  selectedDocument: null,
  setSelectedDocument: (document) => set({ selectedDocument: document }),
  theme: 'dark',
  setTheme: (theme) => set({ theme }),
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  activeTab: 'db',
  setActiveTab: (tab) => set({ activeTab: tab }),
  searchInputRef: null,
  setSearchInputRef: (ref) => set({ searchInputRef: ref }),
  chatInputRef: null,
  setChatInputRef: (ref) => set({ chatInputRef: ref }),
  messages: [],
  setMessages: (messages) => {
    if (Array.isArray(messages)) {
      set({ messages })
    } else {
      set({ messages: [] })
    }
  },
  focusSearchInput: () => {
    const { searchInputRef } = get()
    if (searchInputRef?.current) {
      searchInputRef.current.focus()
    }
  },
  focusChatInput: () => {
    const { chatInputRef } = get()
    if (chatInputRef?.current) {
      chatInputRef.current.focus()
    }
  },
  resetChat: () => {
    set({ messages: [] })
  },
  addDocument: (document) => {
    const { documents, setDocuments, setSelectedDocument, config } = get()
    if (!config?.namespace) return

    const frontmatter = generateFrontmatter(config.namespace)
    const mdx = createDefaultDocument(frontmatter)
    const now = new Date().toISOString()
    
    const newDocument: Document = {
      id: frontmatter['@id'],
      mdx,
      data: JSON.stringify(frontmatter),
      created: now,
      updated: now,
      ...document
    }
    
    const newDocuments = [...documents, newDocument]
    setDocuments(newDocuments)
    setSelectedDocument(newDocument)
  },
  saveDocument: (document) => {
    const { documents, setDocuments, setSelectedDocument } = get()
    const frontmatter = extractFrontmatter(document.mdx)
    const updatedDocument = {
      ...document,
      data: JSON.stringify(frontmatter),
      updated: new Date().toISOString()
    }

    if (frontmatter['@id'] && frontmatter['@id'] !== document.id) {
      updatedDocument.id = frontmatter['@id'] as string
    }

    const updatedDocuments = documents.map((doc) =>
      doc.id === document.id ? updatedDocument : doc
    )
    
    setDocuments(updatedDocuments)
    setSelectedDocument(updatedDocument)
    localStorage.setItem('documents', JSON.stringify(updatedDocuments))
  },
  updateSelectedDocument: (mdx: string) => {
    const { selectedDocument, saveDocument } = get()
    if (selectedDocument) {
      saveDocument({ ...selectedDocument, mdx })
    }
  }
}))