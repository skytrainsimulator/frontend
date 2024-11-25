import { useSimulatorStore } from '@/stores/simulator'

export function useTicker () {
  const store = useSimulatorStore()
  const task = ref<number>()
  onMounted(() => {
    task.value = setInterval(() => store.setNow(Date.now()/*  + (3600 * 8 * 1000) */), 100)
  })
  onUnmounted(() => {
    const _task = task.value
    if (_task) clearInterval(_task)
  })
}
