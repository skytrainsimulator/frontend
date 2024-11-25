// Utilities
import { defineStore } from 'pinia'

export const useSimulatorStore = defineStore('simulator', {
  state: () => ({
    now: ref(Date.now()),
  }),
  actions: {
    setNow (newTime: number) {
      this.now = newTime
    },
  },
})
