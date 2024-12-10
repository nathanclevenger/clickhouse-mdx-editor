import { create } from 'zustand'
import { useChatStore } from './chat/store'
import yaml from 'js-yaml'
import type { ClickHouseConfig, Document } from './types'

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
  appendText: (text: string, addNewline?: boolean) => void
  activeTab: 'db' | 'ai'
  setActiveTab: (tab: 'db' | 'ai') => void
  searchInputRef: React.RefObject<HTMLInputElement> | null
  setSearchInputRef: (ref: React.RefObject<HTMLInputElement>) => void
  chatInputRef: React.RefObject<HTMLTextAreaElement> | null
  setChatInputRef: (ref: React.RefObject<HTMLTextAreaElement>) => void
  focusSearchInput: () => void
  focusChatInput: () => void
  resetChat: () => void
  buffer: string
  appendToBuffer: (text: string) => void
  flushBuffer: () => void
  clearBuffer: () => void
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
    set({ 
      selectedDocument: document,
      activeTab: document ? get().activeTab : 'db'
    })
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

    const frontmatter = {
      _id: `${config.namespace}/ideas/${Date.now()}`
    }
    const mdx = `---\n_id: ${frontmatter._id}\n---\n\n# \n`
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
    const { documents, setDocuments, setSelectedDocument } = get()
    const frontmatter = yaml.load(document.mdx.match(/^---([\s\S]*?)---/)?.[1] || '') as Record<string, unknown>
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
  },
  updateSelectedDocument: (update) => {
    const { selectedDocument, saveDocument } = get()
    if (!selectedDocument) return

    try {
      const newMdx = typeof update === 'function' 
        ? update(selectedDocument.mdx)
        : update

      saveDocument({ ...selectedDocument, mdx: newMdx })
    } catch (error) {
      console.error('Failed to update document:', error)
    }
  },
  appendText: (text: string, addNewline = false) => {
    const { selectedDocument, updateSelectedDocument } = get()
    if (!selectedDocument) return

    updateSelectedDocument(prev => {
      const separator = addNewline ? '\n\n' : ''
      return `${prev}${separator}${text}`
    })
  },
  buffer: '',
  appendToBuffer: (text: string) => {
    console.log('EditorStore: appendToBuffer', { chunk: text })
    set(state => ({ 
      buffer: state.buffer + text 
    }))
  },
  clearBuffer: () => {
    console.log('EditorStore: clearBuffer')
    set({ buffer: '' })
  },
  flushBuffer: () => {
    console.log('EditorStore: flushBuffer')
    const { selectedDocument, buffer } = get()
    if (!selectedDocument || !buffer) return

    // Extract frontmatter and content
    const frontmatterMatch = selectedDocument.mdx.match(/^---([\s\S]*?)---\n\n/)
    const frontmatter = frontmatterMatch ? frontmatterMatch[0] : ''
    const content = frontmatterMatch 
      ? selectedDocument.mdx.slice(frontmatterMatch[0].length)
      : selectedDocument.mdx

    // Create new document content
    const newMdx = `${frontmatter}${content}\n\n${buffer}`

    // Update document
    const updatedDocument = {
      ...selectedDocument,
      mdx: newMdx
    }

    // Update state
    set(state => ({
      selectedDocument: updatedDocument,
      documents: state.documents.map(doc =>
        doc.id === selectedDocument.id ? updatedDocument : doc
      ),
      buffer: ''
    }))

    // Save changes
    get().saveDocument(updatedDocument)
  }
}))