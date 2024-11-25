<template>
  <v-container>
    <div class="text-h2 mb-5">SkytrainSim</div>
    <div>
      SkytrainSim is a project that attempts to emulate the System Management Center (SMC), Vehicle Control Computers
      (VCCs) & "mimics" used to manage and operate the Automatic Train Control (ATC) of the Vancouver SkyTrain.
    </div>
    <div class="text-h3 my-5">Limitations</div>
    <div>
      As of 2024, TransLink does not publish any real-time information regarding train positions. As such, this simulation
      is constructed using TransLink's published schedules, which comes with some limitations:
      <ul class="pl-7">
        <li>Any service disruptions or deviations not present in the published schedule cannot be reflected</li>
        <li>Train consists & IDs will not be known unless entered by community members when spotted</li>
        <li>Any displayed locations of non-revenue trains is a best-effort guess</li>
      </ul>
    </div>
    <div class="text-h3 my-5">Disclaimers</div>
    <ul class="pl-7">
      <li>This project has no affiliation with TransLink, or any of it's subsidiaries / operating companies</li>
      <li>Route and arrival data used in this product or service is provided by permission of TransLink. TransLink assumes no responsibility for the accuracy or currency of the Data used in this product or service.</li>
      <li>Schedule data presented by this project has been significantly modified and may not be accurate. This project is not a wayfinding tool.</li>
    </ul>
    <div class="text-h3 my-5">Credits</div>
    <div>
      Thank you to the <a href="https://omczero.com/">OMCZero</a> Society & members, for being an incredible resource regarding the
      internal and technical operations of the Skytrain system
    </div>
    <div class="text-h3 my-5">Technical Info - How It Works</div>
    <div>
      The project is composed of several interconnected modules. At it's core is a giant PostgreSQL database containing
      GTFS schedule data (imported via the <a href="https://github.com/skytrainsimulator/gtfsImporter">gtfsImporter</a>
      module), GIS map data of the tracks imported from <a href="https://www.openstreetmap.org/">OpenStreetMap</a>
      via the <a href="https://github.com/skytrainsimulator/gisImporter">gisImporter</a>
      module, as well as other data entered by hand. A Java Spring-Boot
      <a href="https://github.com/skytrainsimulator/backend">backend</a> module statically calculates a "timeline" of
      movements and other events for a given day, and serves that for this Vue3
      <a href="https://github.com/skytrainsimulator/frontend">frontend</a> to display.
    </div>
    <div class="text-h3 my-5">Developer</div>
    <div>
      Hey, I'm _11, a Computer Science student in Vancouver with an interest in public transit and automated systems.
      You can find me in my personal <a href="https://discord.gg/7QTS4Xaz7c">Discord server</a>. For serious inquiries,
      you can email me at <span class="text-mono">hey [at] underscore11 [dot] me</span>.
    </div>
  </v-container>
</template>

<script setup lang="ts">

</script>

<style scoped lang="sass">

</style>
