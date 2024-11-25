import { Timeline } from '@/api/simulator'
import { addMinutes, dateToIsoLocal } from '@/api/util'
import { useAppStore } from '@/stores/app'
import { useSimulatorStore } from '@/stores/simulator'
import { defineQuery, useQuery } from '@pinia/colada'

export const useTimeline = defineQuery(() => {
  const appData = useAppStore()
  const simulator = useSimulatorStore()
  return useQuery<Timeline, any>({
    key: ['simulatedTimeline'],
    query: async () => {
      const now = new Date(simulator.now)
      const start = dateToIsoLocal(addMinutes(now, -5))
      const end = dateToIsoLocal(addMinutes(now, 30))
      console.log(`Fetching timeline for ${start} to ${end}`)
      const resp = await fetch(appData.apiHost + `/realtime?start=${start}&end=${end}`)
      if (!resp.ok) throw new Error()
      return resp.json()
    },
  })
})
