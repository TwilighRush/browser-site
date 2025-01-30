<template>
  <div id="app">
    <Header />
    <BackgroundImage />
    <BookmarkSidebar />
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BackgroundImage from './components/BackgroundImage.vue'
import Header from './components/Header.vue'
import BookmarkSidebar from './components/BookmarkSidebar.vue'

export default defineComponent({
  name: 'App',
  components: {
    BackgroundImage,
    Header,
    BookmarkSidebar,
  },
})
</script>

<style>
/* 你可以在这里添加全局样式 */
</style> 