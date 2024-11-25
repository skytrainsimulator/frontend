import { TrackData } from '@/api/trackData'
import { useAppStore } from '@/stores/app'
import { defineQuery, useQuery } from '@pinia/colada'

export const useTrackData = defineQuery(() => {
  const appData = useAppStore()
  return useQuery<TrackData, any>({
    key: ['trackData'],
    query: async () => {
      const resp = await fetch(appData.apiHost + '/gis/trackData')
      if (!resp.ok) throw new Error()
      const json = await resp.json()
      return new TrackData(json)
    },
  })
})
