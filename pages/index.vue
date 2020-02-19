<template>
  <div class="container" :style="size">
    <TV :sessions="sessions">
      <template #video>
        <video v-if="masterStream" autoplay :srcObject.prop="masterStream" />
      </template>
      <template #effects>
        <telop-container
          v-if="streamStore.ready && !streamStore.master"
          position="center"
        >
          <el-button
            class="button"
            icon="custom-icon el-icon-video-camera-solid"
            circle
            @click="startCast"
          ></el-button>
        </telop-container>
        <telop-container v-if="masterStream" :position="position">
          <side-telop tag="速報" message="メッセージ" />
        </telop-container>
      </template>
    </TV>
  </div>
</template>

<style scoped>
.container {
  vertical-align: middle;
  overflow: hidden;
  margin: 0;
}

video {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 100%;
  min-height: 100%;
}
</style>

<script lang="ts">
import { createComponent, ref, watch, computed } from '@vue/composition-api'
import TV from '~/components/TV.vue'
import { TelopContainer, SideTelop } from '~/components/telops'
import useScreenSize from '~/api/useScreenSize'
import useStream from '~/api/useStream'

/*
export async function useFirestore(vue: Vue) {
  const firestore = vue.$firestore
  const channels = await firestore.collection('channels').get()
  channels.forEach((doc: any) => {
    const data = doc.data()
  })
} */

export default createComponent({
  setup(_props, _context) {
    const size = useScreenSize()
    const stream = useStream(process.env.SKYWAY_API_KEY as string)

    const positions = [
      'top-left',
      'top',
      'top-right',
      'right',
      'bottom-right',
      'bottom',
      'bottom-left',
      'left'
    ]
    const counter = ref(2)
    const position = computed(() => positions[counter.value % positions.length])
    /* setInterval(() => {
      counter.value++
    }, 200) */

    watch(() => {
      if (stream.store.ready) {
        stream.joinRoom('testMeshChannel', 'mesh')
      }
    })

    watch(() => {
      console.log(stream.store.sessions.filter((session) => session.stream))
      console.log(stream.masterStream)
    })

    return {
      startCast: stream.startCast,
      position,
      streamStore: stream.store,
      masterStream: stream.masterStream,
      sessions: computed(() =>
        stream.store.sessions.filter((session) => session.stream)
      ),
      size: computed(() => {
        return {
          width: `${size.width}px`,
          height: `${Math.min(size.width * 0.75, size.height)}px`
        }
      })
    }
  },
  components: {
    TelopContainer,
    SideTelop,
    TV
  }
})
</script>
