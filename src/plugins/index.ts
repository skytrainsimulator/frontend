/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

import { PiniaColada } from '@pinia/colada'

// Types
import type { App } from 'vue'
import router from '../router'
import pinia from '../stores'
// Plugins
import vuetify from './vuetify'
import 'vue3-openlayers/styles.css'

import OpenLayersMap from 'vue3-openlayers'

export function registerPlugins (app: App) {
  app
    .use(vuetify)
    .use(router)
    .use(pinia)
    .use(PiniaColada)
    .use(OpenLayersMap)
}
