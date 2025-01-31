<template>
  <div class="background-image" :style="{ backgroundImage: `url(${backgroundImage})` }">
    <div class="time-container">
      <div class="time text-6xl font-bold text-white mb-8 text-center">{{ currentTime }}</div>
    </div>
    <div class="search-box-container">
      <SearchBox />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
import request from '../utils/request';
import SearchBox from './SearchBox.vue'

export default defineComponent({
  name: 'BackgroundImage',
  components: {
    SearchBox
  },
  setup() {
    const backgroundImage = ref('')
    const currentTime = ref('')
    let timer: number | null = null

    const updateTime = () => {
      const now = new Date()
      currentTime.value = now.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    }

    onMounted(async () => {
      try {
        const response = await request(`/images/latest`)
        const {data} =  response
        backgroundImage.value = data.imageUrl
      } catch (error) {
        console.error('Error fetching image from Unsplash:', error)
      }
      updateTime()
      timer = window.setInterval(updateTime, 1000)
    })

    onUnmounted(() => {
      if (timer) {
        clearInterval(timer)
      }
    })

    return { 
      backgroundImage,
      currentTime
    }
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

.time-container {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  user-select: none;
}

.time {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.search-box-container {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
}
</style> 