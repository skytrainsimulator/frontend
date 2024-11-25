import { Coordinate } from 'ol/coordinate'
import { LineString } from 'ol/geom'
import { transform } from 'ol/proj'

export function reproject (coord: Coordinate) : Coordinate {
  return transform(coord, 'EPSG:4326', 'EPSG:3857')
}

export type WayElevation = 'TUNNEL' | 'CUTTING' | 'AT_GRADE' | 'VIADUCT' | 'BRIDGE'
export type WayService = 'MAINLINE' | 'CROSSOVER' | 'SIDING' | 'YARD' | 'SPUR'
export type SwitchTurnoutSide = 'WYE' | 'LEFT' | 'RIGHT'
export type SwitchType = 'DIRECT' | 'FIELD' | 'MANUAL'

export interface Point {
  lng: number,
  lat: number
}

export interface TrackSystem { id: string, name: string, suffix: string }
export interface Node { id: string, point: Point, systemId: string, osmId?: string}
export interface Way {
  id: string,
  fromNode: string,
  toNode: string,
  nodes: string[],
  elevation: WayElevation,
  service: WayService,
  maxSpeed: number,
  isAtc: boolean,
  isBidirectional: boolean,
  osmId?: string
}
export interface NodeMilestone { id: string, description: string }
export interface NodeRailwayCrossing {
  id: string,
  waypairs: [{first: string, second: string}]
}
export interface NodeStopPosition {
  id: string,
  ref: string,
  gtfsId?: string
}
export interface NodeSwitch {
  id: string,
  ref: string,
  type: SwitchType,
  turnoutSide: SwitchTurnoutSide,
  commonWay: string,
  leftWay: string,
  rightWay: string
}

export interface RawTrackData {
  systems: TrackSystem[],
  nodes: Node[],
  ways: Way[],
  bufferStops: string[],
  crossings: string[],
  milestones: NodeMilestone[],
  railwayCrossings: NodeRailwayCrossing[],
  stopPositions: NodeStopPosition[],
  switches: NodeSwitch[]
}

export class ParsedWay implements Way {
  public readonly id: string
  public readonly fromNode: string
  public readonly toNode: string
  public readonly nodes: string[]
  public readonly elevation: WayElevation
  public readonly service: WayService
  public readonly maxSpeed: number
  public readonly isAtc: boolean
  public readonly isBidirectional: boolean
  public readonly osmId?: string
  public readonly lineString: LineString

  public constructor (way: Way, points: Point[]) {
    this.id = way.id
    this.fromNode = way.fromNode
    this.toNode = way.fromNode
    this.nodes = way.nodes
    this.elevation = way.elevation
    this.service = way.service
    this.maxSpeed = way.maxSpeed
    this.isAtc = way.isAtc
    this.isBidirectional = way.isBidirectional
    this.osmId = way.osmId

    this.lineString = new LineString(points.map(l => reproject([l.lng, l.lat])), 'XY')
  }
}

export class TrackData {
  public readonly data: RawTrackData
  public readonly nodes: Map<string, Node> = new Map()
  public readonly ways: Map<string, ParsedWay> = new Map()

  public constructor (rawData: RawTrackData) {
    this.data = rawData

    for (const node of this.data.nodes) {
      this.nodes.set(node.id, node)
    }

    for (const way of this.data.ways) {
      const points = way.nodes.map(n => this.nodes.get(n)?.point).filter(n => n) as Point[]
      this.ways.set(way.id, new ParsedWay(way, points))
    }
  }
}
