<template>
  <v-card>
    <v-card-text>
      <VueDropZone ref="myVueDropZone" id="dropzone" :options="dropZoneOptions" @vdropzone-files-added="getDroppedFile"></VueDropZone>
    </v-card-text>
  </v-card>
</template>

<script>
import VueDropZone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import {mapActions} from 'vuex'
import { v4 as uuidv4 } from 'uuid'

export default {
  data: () => ({
    dropZoneOptions: {
      url: '/',
      autoProcessQueue: false,
      acceptedFiles: 'video/*'
    }
  }),
  methods: {
    // Vuex handlers
    ...mapActions([
      'fetchFileDetails'
    ]),

    // Handle the added files
    getDroppedFile (fileList = []) {
      const files = Array.from(fileList)
        
      let returnArr = []
      if (files && files.constructor === Array && files.length > 0) returnArr = files.map(file => this.validateFile(file))

      // Request node to give us file details
      this.fetchFileDetails(returnArr)
      this.$refs.myVueDropZone.removeAllFiles()
    },

    // Validate the file type
    validateFile (file = {}) {
      if (file && file instanceof File) {
        const { accepted, lastModified, name, path, size, status, type, upload } = file
        return { accepted, lastModified, name, path, size, status, type, upload, id: uuidv4(), isConverted: false, convertTo: null, percentage: 0, isLoading: false }
      }

      return file
    }
  },
  components: {
    VueDropZone
  }
}
</script>

<style>

</style>