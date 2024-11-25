// Utilities
import { defineStore } from 'pinia'
import { version } from '../../package.json'

export const useAppStore = defineStore('app', {
  state: () => ({
    apiHost: import.meta.env.VITE_API_HOST,
    version,
  }),
})
