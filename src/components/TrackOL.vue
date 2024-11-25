<template>
  <ol-map ref="ol" class="position-relative">
    <v-overlay v-model="overlay" contained class="align-center justify-center">
      <v-row v-if="hasLoading">
        <v-col v-for="q in loading" :key="q.name">
          <v-alert :title="'Loading ' + q.name" type="info" density="compact" :icon="false">
            <v-progress-linear indeterminate />
          </v-alert>
        </v-col>
      </v-row>
      <v-row v-if="hasError">
        <v-col v-for="q in errors" :key="q.name">
          <v-alert :title="'Error loading ' + q.name" type="error">
            <div>{{ q.query.error.value }}</div>
            <v-btn variant="outlined" @click="q.query.refetch()">Retry</v-btn>
          </v-alert>
        </v-col>
      </v-row>
    </v-overlay>
    <ol-view
      ref="view"
      :center="center"
      :projection="projection"
      :rotation="rotation"
      :zoom="zoom"
      @change:center="centerChanged"
      @change:resolution="resolutionChanged"
      @change:rotation="rotationChanged"
    />

    <ol-tile-layer>
      <ol-source-osm />
    </ol-tile-layer>

    <ol-rotate-control></ol-rotate-control>
    <ol-fullscreen-control />
<!--    <ol-interaction-link />-->
  </ol-map>
</template>

<script setup lang="ts">
  import { useTrains } from '@/api/activeTrains'
  import { TrackData } from '@/api/trackData'
  import { useTimeline } from '@/queries/simulatedTimeline'
  import { useTrackData } from '@/queries/trackData'
  import { Collection, Feature } from 'ol'
  import { Coordinate } from 'ol/coordinate'
  import { Geometry, Point } from 'ol/geom'
  import VectorLayer from 'ol/layer/Vector'
  import type Map from 'ol/Map'
  import { ObjectEvent } from 'ol/Object'
  import VectorSource from 'ol/source/Vector'
  import { Circle, Stroke, Style } from 'ol/style'
  import { ref } from 'vue'

  const trackQuery = useTrackData()
  const trackData = computed(() => trackQuery.state.value.data)
  const timelineQuery = useTimeline()
  const { trains } = useTrains()

  const queries = [
    { query: trackQuery, name: 'Track Data' },
    { query: timelineQuery, name: 'Timeline' },
  ]
  const loading = computed(() => queries.filter(q => q.query.asyncStatus.value === 'loading'))
  const errors = computed(() => queries.filter(q => q.query.error.value))
  const hasLoading = computed(() => loading.value.some(q => q))
  const hasError = computed(() => errors.value.some(q => q))
  const overlay = computed(() => hasLoading.value || hasError.value)

  const ol = ref<{ map: Map }>()
  const trackFeatures = ref<Collection<Feature<Geometry>>>(new Collection())
  const trainFeatures = ref<Collection<Feature<Geometry>>>(new Collection())
  const center = ref([-13690000, 6319000])
  const projection = ref('EPSG:3857')
  const zoom = ref(12)
  const rotation = ref(0)

  const currentCenter = ref(center.value)
  const currentZoom = ref(zoom.value)
  const currentRotation = ref(rotation.value)
  const currentResolution = ref(0)

  function resolutionChanged (event: ObjectEvent) {
    currentResolution.value = event.target.getResolution()
    currentZoom.value = event.target.getZoom()
  }
  function centerChanged (event: ObjectEvent) {
    currentCenter.value = event.target.getCenter()
  }
  function rotationChanged (event: ObjectEvent) {
    currentRotation.value = event.target.getRotation()
  }

  function renderTrackData (d: TrackData) {
    trackFeatures.value.clear()
    d.ways.values().map(w => {
      const feat = new Feature(w.lineString)
      return feat
    }).forEach(f => trackFeatures.value.push(f))
  }

  onMounted(() => {
    const map = ol.value?.map
    if (!map) throw new Error('map is undefined!')

    const trackLayer = new VectorLayer({
      source: new VectorSource({
        features: trackFeatures.value as Collection<Feature<Geometry>>,
      }),
      // style: new Style({
      //   fill: new Fill({ color: 'red' }),
      //   stroke: new Stroke({ color: 'green', width: 2 }),
      // }),
    })
    map.addLayer(trackLayer)
    const d = trackData.value
    if (d) renderTrackData(d)

    const trainLayer = new VectorLayer({
      source: new VectorSource({
        features: trainFeatures.value as Collection<Feature<Geometry>>,
      }),
      style: new Style({
        image: new Circle({
          // fill: new Fill({ color: 'green' }),
          stroke: new Stroke({ color: 'red', width: 1.5 }),
          radius: 5,
        }),
      }),
    })
    map.addLayer(trainLayer)
  })

  watch(trackData, d => {
    // const _trackVectorLayer = trackVectorLayer.value
    if (!d) return
    renderTrackData(d)
  })

  watch(trains, t => {
    trainFeatures.value.clear()
    t.filter(tt => !!tt.gpsPosition)
      .map(tt => new Feature(new Point(tt.gpsPosition as Coordinate)))
      .forEach(f => trainFeatures.value.push(f))
  })
</script>

<style scoped lang="sass">

</style>
