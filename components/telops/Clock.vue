<template>
  <div class="clock">
    <div class="clock-title">
      <slot name="header">KuiskiTV</slot>
    </div>
    <div class="clock-body">
      <slot name="content">{{ clock }}</slot>
    </div>
  </div>
</template>

<style scoped>
.clock {
  margin-left: 10px;
  width: 20vh;
  padding: 8vh 2vh 2vh 2vh;
  background-color: #ff6868;
  color: #ffffff;
}

.clock-title {
  margin: 0;
  padding: 0;
  font-size: 2vh;
}

.clock-body {
  margin: 0;
  padding: 0;
  line-height: 1;
  font-size: 7vh;
}
</style>

<script lang="ts">
import { createComponent, Ref, ref } from '@vue/composition-api'

function getNow() {
  const now = new Date(Date.now())
  const hour = `0${now.getHours()}`.slice(-2)
  const minute = `0${now.getMinutes()}`.slice(-2)

  return `${hour}:${minute}`
}

export default createComponent({
  setup() {
    const clock: Ref<string> = ref(getNow())

    setInterval(() => {
      const now = getNow()
      if (now !== clock.value) {
        clock.value = now
      }
    }, 1000)

    return {
      clock
    }
  }
})
</script>
