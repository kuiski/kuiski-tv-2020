<template>
  <Channel
    v-if="localStream"
    v-bind="channelParams"
    :local-stream="localStream"
  />
  <div v-else class="container2">
    <el-row class="row">
      <el-button type="warning" size="medium" class="btn" @click="faceCamera"
        >前面カメラ</el-button
      >
    </el-row>
    <el-row class="row">
      <el-button type="success" size="medium" class="btn" @click="backCamera"
        >背面カメラ</el-button
      >
    </el-row>
  </div>
</template>

<style scoped>
.container2 {
  padding: 20px;
}

.row {
  padding-bottom: 5px;
}
.btn {
  width: 90%;
  max-width: 400px;
  padding: 10px;
  font-size: 50px;
}
</style>

<script lang="ts">
import { createComponent, ref, Ref } from '@vue/composition-api'
import { getCameraStream } from '~/api/media'
import Channel from '~/components/Channel.vue'

export default createComponent({
  setup(_props, context) {
    const localStream: Ref<MediaStream | undefined> = ref(undefined)
    const params = context.root.$route.params
    const roomType = context.root.$route.hash?.slice(1) || 'mesh'
    const channelParams = {
      roomName: params.id ?? 'default',
      roomType,
      skywayKey: process.env.SKYWAY_API_KEY
    }

    function faceCamera() {
      getCameraStream(true).then((s) => {
        localStream.value = s
      })
    }

    function backCamera() {
      getCameraStream(false).then((s) => {
        localStream.value = s
      })
    }

    return {
      localStream,
      channelParams,
      faceCamera,
      backCamera
    }
  },
  components: {
    Channel
  }
})
</script>
