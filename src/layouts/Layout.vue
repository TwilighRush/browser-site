<template>
  <div class="layout">
    <Header />
    <BookmarkSidebar />
    <div class="main-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BookmarkSidebar from '../components/BookmarkSidebar.vue'
import Header from '../components/Header.vue'

export default {
  name: 'Layout',
  components: {
    BookmarkSidebar,
    Header
  }
}
</script> 