<template>
  <v-card flat>
    <v-card-text>
      <template v-if="!selectedVideos || selectedVideos.length === 0">
        <v-alert :value="true" type="info">
          No videos selected
        </v-alert>
      </template>

      <template v-if="selectedVideos && selectedVideos.length > 0">
        <v-list dense two-line nav>
          <v-subheader>
            <v-layout row wrap>
              <v-flex class="grow">Selected Videos</v-flex>
              <v-flex class="shrink">
                <v-btn text class="error" color="white" @click="askBeforeReset()">Reset</v-btn>
                <v-btn text class="primary mx-2" color="white" :disabled="!proceedToConvert" @click="triggerConvertCall">Convert</v-btn>
              </v-flex>
            </v-layout>
          </v-subheader>
          <v-list-item-group color="primary">
            <v-list-item v-for="video in selectedVideos" :key="video.id">
              <v-list-item-avatar>
                <v-btn text icon color="white" class="primary" @click="removeSelectedVideo(video.id)" :loading="video.isLoading">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-html="video.name"></v-list-item-title>
                <v-list-item-subtitle v-html="video.format.duration"></v-list-item-subtitle>
                <p v-if="video.percentage">{{video.percentage}} %</p>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn v-if="video.isConverted && !video.isLoading">
                  Show in folder
                </v-btn>
                <v-select v-else :items="availableFormats" v-model="video.convertTo" item-text="option" item-value="value" clearable :disabled="video.isLoading"></v-select>
              </v-list-item-action>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </template>
    </v-card-text>

    <v-dialog v-model="showModel">
      <v-card flat>
        <v-card-title class="headline">Are you sure to reset ?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error darken-1" text @click="showModel = false">No</v-btn>
          <v-btn color="green darken-1" text @click="resetVideos">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import {ipcRenderer} from 'electron'
import {mapGetters, mapMutations, mapActions} from 'vuex'
export default {
  data: () => ({
    showModel: false
  }),
  computed: {
    ...mapGetters([
      'selectedVideos',
      'availableFormats',
    ]),

    // Checks whether we are able to proceed to convert or not
    proceedToConvert () {
      const videos = this.selectedVideos
      if (videos && videos.length > 0) {
        const filteredArr = videos.filter(video => !video.convertTo)
        if (filteredArr && filteredArr.length > 0) return false
        return true
      }

      return false
    }
  },
  methods: {
    ...mapMutations([
      'removeSelectedVideo',
      'removeAllVideos'
    ]),

    ...mapActions([
      'triggerConvertProgress'
    ]),

    askBeforeReset () {
      this.showModel = !this.showModel
    },

    resetVideos () {
      this.removeAllVideos()
      this.showModel = false
    },

    triggerConvertCall () {
      this.triggerConvertProgress(this.selectedVideos)
    }
  }

}
</script>

<style>

</style>