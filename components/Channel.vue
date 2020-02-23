<template>
  <div class="container" :style="size">
    <TV :sessions="wipeStreams">
      <template v-if="masterStream || alternativeStream" #video>
        <video
          v-if="masterStream"
          autoplay
          playsinline
          :srcObject.prop="masterStream"
          class="video"
        />
        <video
          v-if="alternativeStream"
          autoplay
          playsinline
          :srcObject.prop="masterStream"
          class="altVideo"
        />
      </template>
      <template #effects>
        <telop-container v-if="!streamStore.master" position="center">
          <el-button
            class="button"
            icon="custom-icon el-icon-video-camera-solid"
            circle
            @click="startCast"
          ></el-button>
        </telop-container>

        <telop-container position="left">
          <div v-if="debug" class="debug">
            <div>PeerId = {{ streamStore.peer.id }}</div>
            <div>Leader = {{ streamStore.leader }}</div>
            <div>Master = {{ streamStore.master }}</div>
            <div>Members({{ streamStore.members.length }}):</div>
            <div v-for="member in streamStore.members" :key="member.peerId">
              <div>
                {{ member.peerId === streamStore.leader ? '@' : '&nbsp;' }}
                {{ member.peerId === streamStore.master ? '*' : '&nbsp;' }}
                {{ member.peerId }}
                {{ member.peerId === streamStore.peer.id ? '(You)' : '' }}
              </div>
            </div>
            <div>Streams</div>
            <div v-for="session in streamStore.sessions" :key="session.peerId">
              <div>{{ session.peerId }}</div>
            </div>
          </div>
        </telop-container>

        <telop-container position="bottom">
          <div class="bottom-menu">
            <el-button type="text" icon="el-icon-video-camera"></el-button>
            <el-button
              v-if="streamStore.master === streamStore.peer.id"
              type="text"
              icon="el-icon-close"
              @click="stop"
            ></el-button>
            <el-button
              type="text"
              icon="el-icon-chat-line-square"
              @click="debug = !debug"
            ></el-button>
          </div>
        </telop-container>

        <telop-container v-if="streamStore.master" position="top-right">
          <side-telop tag="速報" message="くいすきーTV v2" />
        </telop-container>

        <telop-container v-if="streamStore.master" position="top-left">
          <Clock />
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

.debug {
  background-color: black;
  opacity: 0.5;
  width: 300px;
  height: 300px;
  margin-left: 10px;
  border-radius: 5px;
  color: white;
}

.bottom-menu {
  margin-bottom: 10px;
  padding: 5px 20px;
  background-color: black;
  opacity: 0.5;
  border-radius: 5px;
  font-size: 30px;
  color: white;
}
</style>

<script lang="ts">
import {
  createComponent,
  computed,
  PropType,
  watch
} from '@vue/composition-api'
import TV from '~/components/TV.vue'
import { TelopContainer, SideTelop, Clock } from '~/components/telops'
import { useScreenSize } from '~/api/useScreenSize'
import { useStream } from '~/api/useStream'

/*
export async function useFirestore(vue: Vue) {
  const firestore = vue.$firestore
  const channels = await firestore.collection('channels').get()
  channels.forEach((doc: any) => {
    const data = doc.data()
  })
} */

interface ChannelProps {
  roomName: string
  roomType: 'mesh' | 'sfu'
  skywayKey: string
  localStream: MediaStream
}

export default createComponent<ChannelProps>({
  props: {
    roomName: { type: String },
    roomType: { type: String },
    skywayKey: { type: String },
    localStream: { type: Object as PropType<MediaStream> }
  },
  setup(props, _context) {
    const { size } = useScreenSize()

    const stream = useStream(
      props.skywayKey,
      props.roomName,
      props.roomType,
      props.localStream
    )

    watch(() => {
      console.log(stream.store.sessions)
    })

    return {
      startCast: stream.startCast,
      streamStore: stream.store,
      masterStream: computed(() =>
        stream?.store.sessions.find(
          (session) => (session as any).peerId === stream.store.master
        )
      ),
      alternativeStream: computed(() =>
        stream.store.sessions.find(
          (session) => (session as any).peerId === stream.store.alternative
        )
      ),
      wipeStreams: computed(() =>
        stream.store.sessions.filter(
          (session) => (session as any).peerId !== stream.store.master
        )
      ),
      sessions: stream.store.sessions,
      size: computed(() => {
        return {
          width: `${size.width}px`,
          height: `${Math.min(size.width * 0.75, size.height)}px`
        }
      }),
      stop() {
        stream.stopCast()
      },
      debug: false
    }
  },
  components: {
    TelopContainer,
    SideTelop,
    Clock,
    TV
  }
})
</script>
