import type { ClickHouseConfig, Document } from '../types'

export interface EditorStore {
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
  documentBuffer: string
  appendToBuffer: (text: string) => void
  flushBuffer: () => void
  clearBuffer: () => void
}