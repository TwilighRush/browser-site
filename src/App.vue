<template>
  <div id="app">
    <Header />
    <BackgroundImage />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BackgroundImage from './components/BackgroundImage.vue'
import Header from './components/Header.vue'

export default defineComponent({
  name: 'App',
  components: {
    BackgroundImage,
    Header,
  },
})
</script>

<style>
/* 你可以在这里添加全局样式 */
</style> 