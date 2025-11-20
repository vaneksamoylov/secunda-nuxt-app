export interface Todo {
  id: string
  text: string
  done: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Note {
  id: string
  title: string
  todos: Todo[]
  createdAt: Date
  updatedAt: Date
}
