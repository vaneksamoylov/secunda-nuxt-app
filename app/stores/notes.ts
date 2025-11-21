const STORAGE_KEY = 'notes'

export const useNotesStore = defineStore(STORAGE_KEY, () => {
  const notes = ref<Note[]>([])
  const nextId = ref(1)
  const isLoaded = ref(false)

  // загружает заметки из localStorage при инициализации
  function loadFromStorage(): void {
    if (import.meta.client) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)

        if (stored) {
          const parsed = JSON.parse(stored)
          notes.value = parsed.map((note: Note) => ({
            ...note,
            createdAt: new Date(note.createdAt),
            updatedAt: new Date(note.updatedAt),
            todos: note.todos.map((todo: Todo) => ({
              ...todo,
              createdAt: new Date(todo.createdAt),
              updatedAt: new Date(todo.updatedAt)
            }))
          }))
          nextId.value++
        }
        isLoaded.value = true
      } catch (e) {
        console.error('Failed to load notes from storage:', e)
        isLoaded.value = true
      }
    }
  }

  function getNoteById(id: string): Note | undefined {
    console.log('Поиск заметки', id, 'в массиве:', notes.value)
    return notes.value.find(note => note.id === id)
  }

  function saveToStorage(): void {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes.value))
    }
  }

  function createEmptyNote(): Note {
    const now = new Date()
    return {
      id: String(nextId.value++),
      title: '',
      todos: [],
      createdAt: now,
      updatedAt: now
    }
  }

  function addNote(note: Note): void {
    notes.value.push(note)
    saveToStorage()
  }

  function deleteNote(id: string): void {
    notes.value = notes.value.filter(note => note.id !== id)
    saveToStorage()
  }

  function updateNote(id: string, updates: Partial<Note>): void {
    const note = notes.value.find(note => note.id === id)
    if (note) {
      Object.assign(note, updates, { updatedAt: new Date() })
      saveToStorage()
    }
  }

  function createNoteAndReturnId(): string {
    const note = createEmptyNote()
    addNote(note)
    return note.id
  }

  return {
    notes,
    isLoaded,
    loadFromStorage,
    createNoteAndReturnId,
    deleteNote,
    updateNote,
    getNoteById
  }
})