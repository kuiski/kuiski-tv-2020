<template>
  <div :class="position">
    <slot />
  </div>
</template>

<style scoped>
.top-left {
  position: absolute;
  top: 0;
  left: 0;
}

.top {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, 0);
}

.top-right {
  position: absolute;
  top: 0;
  right: 0;
}

.right {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translate(0, -50%);
}

.bottom-right {
  position: absolute;
  bottom: 0;
  right: 0;
}

.bottom {
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, 0);
}

.bottom-left {
  position: absolute;
  bottom: 0;
  left: 0;
}

.left {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translate(0, -50%);
}

.center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>

<script lang="ts">
import { createComponent } from '@vue/composition-api'

interface Props {
  position:
    | 'top-left'
    | 'top'
    | 'top-right'
    | 'right'
    | 'bottom-right'
    | 'bottom'
    | 'bottom-left'
    | 'left'
}

export default createComponent<Props>({
  props: {
    position: {
      type: String
    }
  },
  name: 'TelopContainer'
})
</script>
