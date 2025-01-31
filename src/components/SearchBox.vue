<template>
  <div class="search-container">
    <div class="search-type-selector">
      <button @click="toggleSearchEngineMenu" class="search-engine-btn">
        <img :src="currentSearchEngine.icon" :alt="currentSearchEngine.name" class="w-5 h-5">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div v-if="showEngineMenu" class="search-engine-menu">
        <div v-for="engine in searchEngines" 
             :key="engine.name" 
             @click="selectSearchEngine(engine)"
             class="search-engine-option">
          <img :src="engine.icon" :alt="engine.name" class="w-5 h-5">
          <span class="ml-2">{{ engine.name }}</span>
        </div>
      </div>
    </div>
    <input 
      type="text" 
      v-model="searchQuery"
      @keyup.enter="handleSearch"
      placeholder="搜索..." 
      class="search-input"
    >
    <button @click="handleSearch" class="search-btn">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'

export default defineComponent({
  name: 'SearchBox',
  setup() {
    const searchQuery = ref('')
    const showEngineMenu = ref(false)
    
    const searchEngines = [
      {
        name: '百度',
        url: 'https://www.baidu.com/s?wd=',
        icon: 'https://www.baidu.com/favicon.ico'
      },
      {
        name: '谷歌',
        url: 'https://www.google.com/search?q=',
        icon: 'https://www.google.com/favicon.ico'
      },
      {
        name: '必应',
        url: 'https://www.bing.com/search?q=',
        icon: 'https://www.bing.com/favicon.ico'
      }
    ]
    
    const currentSearchEngine = ref(searchEngines[0])

    // 从localStorage加载上次选择的搜索引擎
    onMounted(() => {
      const savedEngine = localStorage.getItem('searchEngine')
      if (savedEngine) {
        const engine = searchEngines.find(e => e.name === savedEngine)
        if (engine) {
          currentSearchEngine.value = engine
        }
      }
    })

    const toggleSearchEngineMenu = () => {
      showEngineMenu.value = !showEngineMenu.value
    }

    const selectSearchEngine = (engine: typeof searchEngines[0]) => {
      currentSearchEngine.value = engine
      showEngineMenu.value = false
      // 保存选择的搜索引擎到localStorage
      localStorage.setItem('searchEngine', engine.name)
    }

    const handleSearch = () => {
      if (!searchQuery.value.trim()) return
      const url = currentSearchEngine.value.url + encodeURIComponent(searchQuery.value)
      // 在当前tab页打开
      window.open(url, '_self')
    }

    return {
      searchQuery,
      searchEngines,
      currentSearchEngine,
      showEngineMenu,
      toggleSearchEngineMenu,
      selectSearchEngine,
      handleSearch
    }
  }
})
</script>

<style scoped>
.search-container {
  position: relative;
  display: flex;
  align-items: center;
  width: 600px;
  max-width: 90vw;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  border-radius: 24px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.search-type-selector {
  position: relative;
}

.search-engine-btn {
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 48px;
  background: transparent;
  border: none;
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 24px 0 0 24px;
}

.search-engine-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.search-engine-menu {
  position: absolute;
  bottom: 100%;
  left: 0;
  width: 140px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  margin-bottom: 8px;
  overflow: hidden;
  z-index: 100;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.search-engine-option {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.search-engine-option:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.search-input {
  flex: 1;
  height: 48px;
  padding: 0 20px;
  border: none;
  background: transparent;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  caret-color: white;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.search-input:focus {
  outline: none;
}

.search-btn {
  padding: 0 20px;
  height: 48px;
  background: transparent;
  border: none;
  border-left: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.2s;
  border-radius: 0 24px 24px 0;
}

.search-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}
</style> 