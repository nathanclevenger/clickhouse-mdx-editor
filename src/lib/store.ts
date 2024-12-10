import { create } from 'zustand'
import { ClickHouseConfig, Document } from './types'
import { generateFrontmatter, createDefaultDocument } from './utils'
import { useChatStore } from './chat/store'
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
  updateSelectedDocument: (update: string | ((prev: string) => string)) => void
  activeTab: 'db' | 'ai'
  setActiveTab: (tab: 'db' | 'ai') => void
  searchInputRef: React.RefObject<HTMLInputElement> | null
  setSearchInputRef: (ref: React.RefObject<HTMLInputElement>) => void
  chatInputRef: React.RefObject<HTMLTextAreaElement> | null
  setChatInputRef: (ref: React.RefObject<HTMLTextAreaElement>) => void
  focusSearchInput: () => void
  focusChatInput: () => void
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
  setSelectedDocument: (document) => {
    console.log('Setting selected document:', document)
    set({ 
      selectedDocument: document,
      activeTab: document ? get().activeTab : 'db' // Switch to DB tab if no document
    })
    // Reset chat messages when document changes
    useChatStore.getState().resetChat()
  },
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
    useChatStore.getState().resetChat()
  },
  addDocument: (document) => {
    const { documents, setDocuments, setSelectedDocument, config } = get()
    if (!config?.namespace) return

    const frontmatter = generateFrontmatter(config.namespace)
    const mdx = createDefaultDocument(frontmatter)
    const now = new Date().toISOString()
    
    const newDocument: Document = {
      id: frontmatter._id,
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
    console.log('Saving document:', document)
    const { documents, setDocuments, setSelectedDocument } = get()
    const frontmatter = extractFrontmatter(document.mdx)
    const updatedDocument = {
      ...document,
      data: JSON.stringify(frontmatter),
      updated: new Date().toISOString()
    }

    if (frontmatter._id && frontmatter._id !== document.id) {
      updatedDocument.id = frontmatter._id as string
    }

    const updatedDocuments = documents.map((doc) =>
      doc.id === document.id ? updatedDocument : doc
    )
    
    setDocuments(updatedDocuments)
    setSelectedDocument(updatedDocument)
    localStorage.setItem('documents', JSON.stringify(updatedDocuments))
  },
  updateSelectedDocument: (update) => {
    console.log('Updating selected document with:', update)
    const { selectedDocument, saveDocument } = get()
    if (!selectedDocument) {
      console.warn('No selected document to update')
      return
    }

    try {
      const newMdx = typeof update === 'function' 
        ? update(selectedDocument.mdx)
        : update

      console.log('New MDX content:', newMdx)
      saveDocument({ ...selectedDocument, mdx: newMdx })
    } catch (error) {
      console.error('Failed to update document:', error)
    }
  }
}))