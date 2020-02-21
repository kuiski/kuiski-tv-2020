<template>
  <div class="container" type="flex" justify="end">
    <div v-for="session in sessions" :key="session.peerId" :span="4">
      <slot>
        <div class="wipe">
          <video autoplay :srcObject.prop="session" class="video" />
        </div>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.container {
  position: absolute;
  top: 20%;
  width: 100%;
  display: flex;
  justify-content: flex-end;
}

.wipe {
  width: 20vw;
  height: 20vw;
  overflow: hidden;
  position: relative;
  border: 1px solid gray;
  margin-right: 10px;
}

.wipe video {
  object-fit: cover;
  width: 100%;
  height: 100%;
  /*transform: scaleX(-1); */
}
</style>

<script lang="ts">
import { createComponent, PropType } from '@vue/composition-api'
// import { StreamSession } from '~/api/useStream'

interface WindowProps {
  sessions: MediaStream[]
}

export default createComponent<WindowProps>({
  props: {
    sessions: { type: Array as PropType<MediaStream[]> }
  }
})
</script>
