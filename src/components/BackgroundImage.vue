<template>
  <div class="background-image" :style="{ backgroundImage: `url(${backgroundImage})` }">
    <h1 class="text-4xl font-bold text-white">Welcome to Your New Tab</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { unsplashAccessKey, unsplashUrl } from '../constant'

export default defineComponent({
  name: 'BackgroundImage',
  setup() {
    const backgroundImage = ref('')

    onMounted(async () => {
      try {
        const response = await fetch(`${unsplashUrl}/photos/random?client_id=${unsplashAccessKey}`)
        const data = await response.json()
        backgroundImage.value = data.urls.full
      } catch (error) {
        console.error('Error fetching image from Unsplash:', error)
      }
    })

    return { backgroundImage }
  },
})
</script>

<style scoped>
.background-image {
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style> 