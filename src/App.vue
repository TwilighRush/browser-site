<template>
  <BackgroundImage />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BackgroundImage from './components/BackgroundImage.vue'

export default defineComponent({
  name: 'App',
  components: {
    BackgroundImage,
  },
})
</script>

<style>
/* 你可以在这里添加全局样式 */
</style> 