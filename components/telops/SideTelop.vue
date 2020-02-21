<template>
  <div class="telop">
    <div class="message">{{ message }}</div>
  </div>
</template>

<style scoped>
.telop {
  font-size: 48px;
  line-height: 0;
  margin-top: 20px;
}

.tag {
  display: inline-block;
  vertical-align: middle;
  width: 100px;
  height: 100px;
  border-radius: 50px;
  background-color: #cf4c4e;
  font-size: 25x;
}

.message {
  line-height: 1em;
  padding: 0.5em;
  padding-top: 0.6em;
  height: 75px;
  min-width: 400px;
  border-left: 10px solid #cf4c4e;
  border-bottom: 1px solid #cf4c4e;
  display: inline-block;
  vertical-align: middle;
  font-size: 30px;
  text-align: left;
  background-color: #fff;
}
</style>

<script lang="ts">
import { createComponent } from '@vue/composition-api'

export interface SideTelopProps {
  /**
   * 「速報」とか「次は」みたいなやつ。2文字。
   */
  tag: string

  /**
   * 具体的なメッセージ
   */
  message: string
}

export default createComponent<SideTelopProps>({
  props: {
    tag: {
      type: String
    },
    message: {
      type: String
    }
  },
  setup(_props) {
    return {}
  }
})
</script>
