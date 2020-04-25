<template>
  <v-app>
    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>

      <v-overlay
          :absolute="true"
          :value="loaderState"
        >
          <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
    </v-content>
  </v-app>
</template>

<script>
import {ipcRenderer} from 'electron'
import {mapGetters, mapMutations} from 'vuex'
export default {
  name: 'App',
  computed: {
    ...mapGetters([
      'loaderState'
    ]),
  },
  methods: {
    ...mapMutations([
      'storeSelectedVideos',
      'setLoaderState',
      'updateSelectedVideo',
      'updateSelectedVideoPercentage',
      'removeSelectedVideo'
    ]),

    // Handle the video details sent by system
    parseSelectedVideoDetails (details = []) {
      this.storeSelectedVideos(details) // Store the details of selected videos
      this.setLoaderState(false) // Store the details of selected videos
    }
  },
  components: {

  },

  data: () => ({
    //
  }),

  mounted () {
    // Details of selected file returned by node
    ipcRenderer.on('file:retrieveDetails', (event,details) => this.parseSelectedVideoDetails(details))
    ipcRenderer.on('conversion:end', (event,details) => this.updateSelectedVideo(details))
    ipcRenderer.on('conversion:progress', (event,details) => this.updateSelectedVideoPercentage(details))
  }
};
</script>
