import {
  NodeTrackPosition,
  SimulatedTrain,
  TrackPosition,
  TrainDwellTimelineEvent,
  TrainMoveConstantTimelineEvent,
  TrainPositionTimelineEvent,
  TrainTimelineEvent,
  WayTrackPosition,
} from '@/api/simulator'
import { useTicker } from '@/api/ticker'
import { reproject } from '@/api/trackData'
import { useTimeline } from '@/queries/simulatedTimeline'
import { useTrackData } from '@/queries/trackData'
import { useSimulatorStore } from '@/stores/simulator'
import { Coordinate } from 'ol/coordinate'

export interface ActiveTrain extends SimulatedTrain {
  activeEvents: TrainTimelineEvent[],
  position?: TrackPosition,
  gpsPosition?: Coordinate
  gtfsTrip?: string,
  gtfsStop?: string
}

export function useTrains () {
  const trains = ref<ActiveTrain[]>([])
  useTicker()
  const timelineQuery = useTimeline()
  const trackQuery = useTrackData()
  const simulatorStore = useSimulatorStore()

  const update = () => {
    const now = simulatorStore.now
    const timeline = timelineQuery.state.value.data
    const trackData = trackQuery.state.value.data

    if (!timeline || !trackData) return
    trains.value = timeline.trains.map<ActiveTrain | null>(t => {
      const activeEvents = t.events.filter(e => e.timeFrom <= now && now < e.timeTo)
      if (activeEvents.length === 0) return null
      const positions = activeEvents.filter(e => e.eventType === 'TrainDwell' || e.eventType === 'TrainMoveConstant' || e.eventType === 'TrainMoveChangingSpeed') as TrainPositionTimelineEvent[]
      let position: TrackPosition | undefined
      if (positions.length > 0) {
        const positionEvent = positions[positions.length - 1]
        if (positionEvent.eventType === 'TrainDwell') {
          position = (positionEvent as TrainDwellTimelineEvent).dwellPosition
        } else if (positionEvent.eventType === 'TrainMoveConstant') {
          const { timeFrom, timeTo, path } = (positionEvent as TrainMoveConstantTimelineEvent)
          const percentAlong = (now - timeFrom) / (timeTo - timeFrom)
          const totalLength = path.map(p => p.length).reduce((l, c) => l + c)
          let distanceAlong = percentAlong * totalLength

          for (const way of path) {
            if (distanceAlong <= way.length) {
              const percentAlongWay = distanceAlong / way.length
              if (way.contraflow) position = { wayId: way.wayId, position: way.from - percentAlongWay }
              else position = { wayId: way.wayId, position: way.from + percentAlongWay }
              break
            }
            distanceAlong -= way.length
          }
        }
      }

      let gpsPosition: Coordinate | undefined
      if (position) {
        if ((position as any).nodeId) {
          const { nodeId } = (position as NodeTrackPosition)
          const node = trackData?.nodes?.get(nodeId)
          if (node) gpsPosition = reproject([node.point.lng, node.point.lat])
        } else if ((position as any).wayId) {
          const wayPosition = (position as WayTrackPosition)
          const way = trackData?.ways?.get(wayPosition.wayId)
          if (way) gpsPosition = way.lineString.getCoordinateAt(wayPosition.position)
        }
      }

      return {
        id: t.id,
        events: t.events,
        earliestTime: t.earliestTime,
        latestTime: t.latestTime,
        activeEvents,
        position,
        gpsPosition,
      }
    }).filter<ActiveTrain>(t => !!t)
  }
  watchEffect(() => update())

  return { trains }
}
