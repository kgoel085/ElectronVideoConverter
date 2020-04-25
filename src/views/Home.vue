<template>
  <v-layout row wrap>
    <!-- Drop zone object -->
    <v-flex xs12>
      <DropZone></DropZone>
    </v-flex>

    <!-- Selected videos listing -->
    <v-flex xs12>
      <VideoListing></VideoListing>
    </v-flex>
  </v-layout>
</template>

<script>
const DropZone = () => import('@/components/dropZone.vue')
const VideoListing = () => import('@/components/listVideos.vue')

export default {
  data: () => ({

  }),
  components: {
    DropZone,
    VideoListing
  }
}
</script>

<style>

</style>