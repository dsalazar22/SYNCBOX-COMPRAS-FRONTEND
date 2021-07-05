<template>
  <div>
        <div class="row"
        >
          <div
            class="col-xs-12, col-md-6"
          >
            <b-card
              dark
              color="primary"
            >
              <b-card-title>
                
                <span
                  class="title font-weight-light"
                  v-if="device"
                >
                  {{ device.label }}
                </span>
              </b-card-title>
              <b-card-text class="px-0">
                <web-cam
                  ref="webcam"
                  width="100%"
                  :deviceId="deviceId"
                  @started="onStarted"
                  @stopped="onStopped"
                  @error="onError"
                  @cameras="onCameras"
                  @camera-change="onCameraChange"
                  :isFrontCam="frontCam"
                  :debug="true"
                  :googleKey="googleKey"
                />
              </b-card-text>
            </b-card>
          </div>
             <div
            class="col-xs-12, col-md-6"
          >
            <b-card>
              <div
                tile="tile"
                size="100%"
                color="grey lighten-4"
              ><img :src="img" />
              </div>
              <b-card-title primary-title>
                Captured Image
              </b-card-title>

              <b-card-title v-if="report">
                Google is guessing
                <v-chip
                  v-for="(data,index) in report"
                  :key="`report-${index}`"
                  color="green"
                  text-color="white"
                >
                  <div class="green darken-4">{{data.score | percent}}</div>
                  {{data.description}}
                </v-chip>
              </b-card-title>
              <div>
                <b-btn
                  flat
                  color="orange"
                  @click="sendGVision"
                  :disabled="!img"
                >Google vision Analayis</b-btn>
              </div>
            </b-card>
          </div>
          <b-select
            xs4
            :items="devices"
            label="Select Device"
            item-text="label"
            item-value="deviceId"
            v-model="camera"
          ></b-select>
          <!-- <b-switch
            xs4
            color="warning"
            :label="`Front cam: ${frontCam.toString()}`"
            v-model="frontCam"
          ></b-switch> -->
          <b-btn
            color="primary"
            @click="onCapture"
          >Capture Photo 
          </b-btn>
          <b-btn
            color="error"
            @click="onStop"
          >Stop Camera</b-btn>
          <b-btn
            color="success"
            @click="onStart"
          >Start Camera</b-btn>

        </div>
  </div>
</template>

<script>
import { WebCam } from 'vue-cam-vision'
import { find, head } from 'lodash'
// import toolbar from './toolbar'
export default {
  name: 'app',
  components: {
    WebCam,
    // toolbar
  },
  data () {
    return {
      img: null,
      camera: null,
      deviceId: null,
      devices: [],
      frontCam: true,
      report: null,
      googleKey: process.env.VUE_APP_OCR_GVA
    }
  },
  computed: {
    device: function () {
      return find(this.devices, n => n.deviceId == this.deviceId)
    }
  },
  watch: {
    camera: function (id) {
      this.deviceId = id
    },
    devices: function () {
      if (typeof window.orientation === 'undefined') {
        // Once we have a list select the first one
        let first = head(this.devices)
        if (first) {
          this.camera = first.deviceId
          this.deviceId = first.deviceId
        }
      } else {
        this.frontCam = false
      }
    }
  },
  methods: {
    async sendGVision () {
      const res = await this.$refs.webcam.googleVision()
      console.log(res)
      this.report = res.labelAnnotations
    },
    async onCapture () {
      this.img = await this.$refs.webcam.capture()
    },
    onStarted (stream) {
      console.log('On Started Event', stream)
      stream.onactive = this.test()
    },
    test(){
        console.log(this.$refs.webcam)
    },
    onStopped (stream) {
      console.log('On Stopped Event', stream)
    },
    onStop () {
      this.$refs.webcam.stop()
    },
    onStart () {
      this.$refs.webcam.start()
    },
    onError (error) {
      console.log('On Error Event', error)
    },
    onCameras (cameras) {
      this.devices = cameras
      console.log('On Cameras Event', cameras)
    },
    onCameraChange (deviceId) {
      this.deviceId = deviceId
      this.camera = deviceId
      console.log('On Camera Change Event', deviceId)
    }
  },
  filters: {
    percent: function (value) {
      if (!value) return ''
      return (Math.floor((value) * 10000) / 100).toFixed(0) + '%'
    }
  }
}
</script>