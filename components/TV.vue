<template>
  <div class="tv">
    <slot name="video">
      <img src="/testcard.png" alt="testcard" class="video" />
    </slot>
    <slot name="wipes">
      <wipes :sessions="sessions" />
    </slot>
    <slot name="effects" />
  </div>
</template>

<style>
.custom-icon {
  font-size: 120px;
}
</style>

<style scoped>
.tv {
  width: 100%;
  height: 100%;
  position: relative;
}

.video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.8;
}
</style>

<script lang="ts">
import { createComponent, PropType } from '@vue/composition-api'
import Wipes from '~/components/Wipes.vue'
import { StreamSession } from '~/api/useStream'

interface TvProps {
  sessions: StreamSession[]
}

export default createComponent<TvProps>({
  props: {
    sessions: {
      type: Array as PropType<StreamSession[]>
    }
  },
  components: {
    Wipes
  }
})
</script>
