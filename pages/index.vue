<template>
  <div class="container">
    <h1>KuiskiTV</h1>
    <el-row class="row">
      <el-button type="primary" size="medium" class="btn" @click="hinadan"
        >参加</el-button
      >
    </el-row>
    <el-row class="row">
      <el-button type="warning" size="medium" class="btn"
        >ディレクター</el-button
      >
    </el-row>
  </div>
</template>

<style scoped>
.container {
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
import { createComponent } from '@vue/composition-api'
import Channel from '~/components/Channel.vue'

export default createComponent({
  setup(_props, context) {
    function hinadan() {
      context.root.$router.push('/channel/kuiski')
    }

    return {
      hinadan
    }
  },
  components: {
    Channel
  }
})
</script>
