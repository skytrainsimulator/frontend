<template>
  <v-container fluid>
    <v-alert border="start" border-color="warning" class="mb-5" closable>
      This simulator is still in an early state. There are many known inaccuracies with train positions. The simulator
      also currently lacks any sort of interactivity and the rendering of many track features - this will come with time.
    </v-alert>
    <TrackOL style="height: 75dvh" />
  </v-container>
</template>

<script setup lang="ts">

</script>

<style scoped lang="sass">

</style>
