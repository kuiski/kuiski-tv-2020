<template>
  <div class="container" type="flex" justify="end">
    <div v-for="session in sessions" :key="session.peerId" :span="4">
      <slot>
        <div class="wipe">
          <video autoplay :srcObject.prop="session.stream" />
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
  width: 35vh;
  height: 35vh;
  overflow: hidden;
  position: relative;
  border: 1px solid gray;
  margin-right: 10px;
}

.wipe video {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
</style>

<script lang="ts">
import { createComponent, PropType, watch } from '@vue/composition-api'
import { StreamSession } from '~/api/useStream'

interface WindowProps {
  sessions: StreamSession[]
}

export default createComponent<WindowProps>({
  props: {
    sessions: { type: Array as PropType<StreamSession[]> }
  },
  setup(props) {
    watch(() => {
      console.log(props.sessions)
    })
    return {}
  }
})
</script>
