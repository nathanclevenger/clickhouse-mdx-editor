import { create } from 'zustand'
import type { EditorStore } from './types'
import { createDocument, updateDocument } from './document'
import { appendToBuffer, flushBufferToDocument } from './buffer'
import { useChatStore } from '../chat/store'

export const useEditorStore = create<EditorStore>((set, get) => ({
  config: null,
  setConfig: (config) => {
    console.log('Store: Setting config')
    set({ config })
    localStorage.setItem('clickhouse-config', JSON.stringify(config))
  },

  documents: [],
  setDocuments: (documents) => {
    console.log('Store: Setting documents:', documents.length)
    set({ documents })
    localStorage.setItem('documents', JSON.stringify(documents))
  },

  selectedDocument: null,
  setSelectedDocument: (document) => {
    console.log('Store: Setting selected document:', document?.id)
    set({ 
      selectedDocument: document,
      activeTab: document ? get().activeTab : 'db'
    })
    useChatStore.getState().resetChat()
  },

  theme: 'dark',
  setTheme: (theme) => {
    console.log('Store: Setting theme:', theme)
    set({ theme })
  },

  searchQuery: '',
  setSearchQuery: (query) => {
    console.log('Store: Setting search query:', query)
    set({ searchQuery: query })
  },

  activeTab: 'db',
  setActiveTab: (tab) => {
    console.log('Store: Setting active tab:', tab)
    set({ activeTab: tab })
  },

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
    console.log('Store: Resetting chat')
    useChatStore.getState().resetChat()
  },

  addDocument: (document) => {
    console.log('Store: Adding new document')
    const { documents, setDocuments, setSelectedDocument, config } = get()
    if (!config?.namespace) return

    const newDocument = createDocument(config.namespace, document)
    console.log('Store: Created new document:', newDocument)
    
    const newDocuments = [...documents, newDocument]
    setDocuments(newDocuments)
    setSelectedDocument(newDocument)
  },

  saveDocument: (document) => {
    console.log('Store: Saving document:', document.id)
    const { documents, setDocuments, setSelectedDocument } = get()
    const updatedDocument = updateDocument(document)
    
    const updatedDocuments = documents.map((doc) =>
      doc.id === document.id ? updatedDocument : doc
    )
    
    setDocuments(updatedDocuments)
    setSelectedDocument(updatedDocument)
  },

  updateSelectedDocument: (update) => {
    console.log('Store: Updating selected document')
    const { selectedDocument, saveDocument } = get()
    if (!selectedDocument) return

    try {
      const newMdx = typeof update === 'function' 
        ? update(selectedDocument.mdx)
        : update

      saveDocument({ ...selectedDocument, mdx: newMdx })
    } catch (error) {
      console.error('Store: Failed to update document:', error)
    }
  },

  appendText: (text: string, addNewline = false) => {
    console.log('Store: Appending text:', { length: text.length, addNewline })
    const { selectedDocument, updateSelectedDocument } = get()
    if (!selectedDocument) return

    updateSelectedDocument(prev => {
      const separator = addNewline ? '\n\n' : ''
      return `${prev}${separator}${text}`
    })
  },

  buffer: '',
  appendToBuffer: (text: string) => {
    console.log('Store: Appending to buffer:', text)
    set(state => ({
      buffer: appendToBuffer(state.buffer, text)
    }))
  },

  clearBuffer: () => {
    console.log('Store: Clearing buffer')
    set({ buffer: '' })
  },

  flushBuffer: () => {
    console.log('Store: Starting buffer flush')
    const { selectedDocument, buffer } = get()
    if (!selectedDocument || !buffer) {
      console.log('Store: Nothing to flush')
      return
    }

    const updatedDocument = flushBufferToDocument(selectedDocument, buffer)
    
    set(state => ({
      selectedDocument: updatedDocument,
      documents: state.documents.map(doc =>
        doc.id === selectedDocument.id ? updatedDocument : doc
      ),
      buffer: ''
    }))

    get().saveDocument(updatedDocument)
  }
}))

export type { EditorStore }