export interface NodeTrackPosition {
  nodeId: string
}
export interface WayTrackPosition {
  wayId: string,
  position: number
}

export type TrackPosition = NodeTrackPosition | WayTrackPosition

export interface PathingWay {
  from: number,
  to: number,
  wayId: string,
  contraflow: boolean,
  percentLength: number,
  length: number,
  staticWeight: number
}

export interface TimelineEvent {
  timeFrom: number,
  timeTo: number,
  eventType: string
}

export interface TrainTimelineEvent extends TimelineEvent {}
export interface GlobalTimelineEvent extends TimelineEvent {}

export interface TimelineContainer<T extends TimelineEvent> {
  events: T[],
  earliestTime: number,
  latestTime: number
}

export interface SimulatedTrain extends TimelineContainer<TrainTimelineEvent> {
  id: string
}

export interface Timeline extends TimelineContainer<GlobalTimelineEvent> {
  trains: SimulatedTrain[],
}

export interface TrainPositionTimelineEvent extends TrainTimelineEvent {
  fromPosition: TrackPosition,
  toPosition: TrackPosition
}

export interface TrainDwellTimelineEvent extends TrainPositionTimelineEvent {
  eventType: 'TrainDwell',
  dwellPosition: TrackPosition
}

export interface TrainMoveConstantTimelineEvent extends TrainPositionTimelineEvent {
  eventType: 'TrainMoveConstant',
  path: PathingWay[],
  speed: number
}

export interface TrainMoveChangingSpeedTimelineEvent extends TrainPositionTimelineEvent {
  eventType: 'TrainMoveChangingSpeed',
  path: PathingWay[],
  speedFrom: number,
  speedTo: number,
  acceleration: number
}
