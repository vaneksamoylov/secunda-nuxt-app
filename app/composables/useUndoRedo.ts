export const useUndoRedo = <T>(initialState: T) => {
  const history = ref<T[]>([JSON.parse(JSON.stringify(initialState))]) as Ref<T[]>
  const currentIndex = ref(0)
  
  const currentState = computed({
    get: () => history.value[currentIndex.value],
    set: (value: T) => {
      history.value[currentIndex.value] = value
    }
  })
  
  const canUndo = computed(() => currentIndex.value > 0)
  const canRedo = computed(() => currentIndex.value < history.value.length - 1)
  
  const pushState = (state: T) => {
    // Удаляем все состояния после текущего индекса
    history.value = history.value.slice(0, currentIndex.value + 1)
    history.value.push(JSON.parse(JSON.stringify(state)))
    currentIndex.value++
  }
  
  const undo = () => {
    if (canUndo.value) {
      currentIndex.value--
    }
  }
  
  const redo = () => {
    if (canRedo.value) {
      currentIndex.value++
    }
  }
  
  return {
    state: currentState,
    pushState,
    undo,
    redo,
    canUndo,
    canRedo
  }
}