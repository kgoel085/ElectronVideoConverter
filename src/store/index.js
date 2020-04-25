import Vue from 'vue'
import Vuex from 'vuex'
import { ipcRenderer } from 'electron'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentLoaderState: false,
    selectedVideos: [],
    availableFormats: [
      { value: 'avi', option: 'AVI' },
      { value: 'm4v', option: 'M4V raw MPEG-4' },
      { value: 'mov', option: 'MOV / QuickTime' },
      { value: 'mp4', option: 'MP4 / QuickTime' },
      { value: 'mpeg', option: 'MPEG' },
      { value: 'ogv', option: 'OGV' }
    ]
  },
  getters: {
    loaderState: state => state.currentLoaderState, // Returns the current state of the loader
    selectedVideos: state => state.selectedVideos, // Stores the user selected videos
    availableFormats: state => state.availableFormats // Available formats to convert from
  },
  mutations: {
    // Set the loader state
    setLoaderState (state, loaderState = false) {
      state.currentLoaderState = loaderState
    },

    // Store the selected video information
    storeSelectedVideos (state, selectedVideos = []) {
      if (selectedVideos && selectedVideos.constructor === Array && selectedVideos.length) state.selectedVideos = selectedVideos
    },

    // Update selected object
    updateSelectedVideo (state, videoObj = {}) {
      if (videoObj) {
        const { id } = videoObj
        if (id) {
          const indexFound = state.selectedVideos.findIndex(obj => obj.id === id)
          if (indexFound !== null && indexFound >= 0) {
            state.selectedVideos.splice(indexFound, 1, videoObj)
            // state.selectedVideos[indexFound] = videoObj
          }
        }
      }
    },

    // Update selected object percentage
    updateSelectedVideoPercentage (state, videoObj = {}) {
      if (videoObj) {
        const { id } = videoObj
        if (id) {
          const indexFound = state.selectedVideos.findIndex(obj => obj.id === id)
          if (indexFound !== null && indexFound >= 0) {
            videoObj.isLoading = true
            const percentage = (videoObj.currentFps / videoObj.frames) * 100
            if (percentage > 0) videoObj.percentage = percentage
            if (percentage >= 100) videoObj.isConverted = true

            state.selectedVideos.splice(indexFound, 1, videoObj)
          }
        }
      }
    },

    // Remove a selected video
    removeSelectedVideo (state, id = null) {
      if (id) {
        const filteredArr = state.selectedVideos.filter(video => video.id !== id)
        if (filteredArr) state.selectedVideos = filteredArr
      }
    },

    // Remove all the selected videos
    removeAllVideos (state) {
      state.selectedVideos = []
    }
  },
  actions: {
    // Get file details
    fetchFileDetails ({ commit }, files = []) {
      commit('setLoaderState', true) // Show loader
      ipcRenderer.send('file:getDetails', files)
    },

    // Trigger the convert progress
    triggerConvertProgress ({ commit }, files = []) {
      // console.log('Files to convert are: ', files)
      ipcRenderer.send('file:convert', files)
    }
  }
})
