<template>
  <div class="quick-links-container">
    <div class="content-wrapper">
      <draggable 
        v-model="links" 
        class="links-wrapper"
        @end="onDragEnd"
        item-key="id"
      >
        <template #item="{ element }">
          <div class="link-item">
            <a :href="element.url" class="link-content">
              <img 
                :src="element.icon" 
                class="site-icon"
                @error="handleIconError($event, element)" 
                :alt="element.name[0]"
              />
              <span class="site-name">{{ element.name }}</span>
            </a>
            <button class="delete-btn" @click.stop="deleteLink(element.id)">×</button>
          </div>
        </template>
      </draggable>
      
      
      <div class="add-link" @click="showAddDialog = true">+</div>
    </div>

    <!-- 添加新链接的对话框 -->
    <div v-if="showAddDialog" class="dialog-overlay" @click.self="showAddDialog = false">
      <div class="dialog">
        <h3>添加新网站</h3>
        <input v-model="newLink.name" placeholder="网站名称" />
        <input 
          v-model="newLink.url" 
          placeholder="网站地址" 
          @input="handleUrlInput"
        />
        <div class="dialog-buttons">
          <button @click="addLink" :disabled="!isValidInput">确定</button>
          <button @click="showAddDialog = false">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import draggable from 'vuedraggable'
import { get, post } from '../utils/request'

interface QuickLink {
  id: number
  name: string
  url: string
  icon?: string
}

export default defineComponent({
  name: 'QuickLinks',
  components: {
    draggable,
  },
  setup() {
    const links = ref<QuickLink[]>([])
    const showAddDialog = ref(false)
    const newLink = ref({
      name: '',
      url: '',
      icon: ''
    })

    const isValidInput = computed(() => {
      return newLink.value.name.trim() && isValidUrl(newLink.value.url)
    })

    const isValidUrl = (url: string) => {
      try {
        new URL(url.startsWith('http') ? url : `https://${url}`)
        return true
      } catch {
        return false
      }
    }

    const handleUrlInput = () => {
      let url = newLink.value.url
      if (url && !url.startsWith('http')) {
        url = `https://${url}`
      }
      newLink.value.url = url
    }

    const handleIconError = (event: Event, link: QuickLink) => {
      const img = event.target as HTMLImageElement
      // 当图标加载失败时，显示网站首字母
      img.style.backgroundColor = '#' + Math.floor(Math.random()*16777215).toString(16)
      img.style.color = '#fff'
      img.style.display = 'flex'
      img.style.alignItems = 'center'
      img.style.justifyContent = 'center'
      img.style.fontSize = '12px'
      img.style.fontWeight = 'bold'
      img.src = ''
      img.onerror = null
    }

    const loadLinks = async () => {
      // 先从 localStorage 获取数据
      const localLinks = localStorage.getItem('quickLinks')
      if (localLinks) {
        links.value = JSON.parse(localLinks)
      }

      try {
        // 再从服务器获取最新数据
        const response = await get('/api/quicklinks')
        if (response.data) {
          links.value = response.data
          localStorage.setItem('quickLinks', JSON.stringify(response.data))
        }
      } catch (error) {
        console.error('获取快捷链接失败:', error)
      }
    }

    const saveLinks = async () => {
      localStorage.setItem('quickLinks', JSON.stringify(links.value))
      try {
        await post('/api/quicklinks', { links: links.value })
      } catch (error) {
        console.error('保存快捷链接失败:', error)
      }
    }

    const addLink = () => {
      if (isValidInput.value) {
        const url = newLink.value.url.startsWith('http') 
          ? newLink.value.url 
          : `https://${newLink.value.url}`
        
        links.value.push({
          id: Date.now(),
          name: newLink.value.name,
          url: url,
          icon: `${url}/favicon.ico`
        })
        saveLinks()
        showAddDialog.value = false
        newLink.value = { name: '', url: '', icon: '' }
      }
    }

    const deleteLink = (id: number) => {
      links.value = links.value.filter(link => link.id !== id)
      saveLinks()
    }

    const onDragEnd = () => {
      // 获取本地存储的原始顺序
      const localLinks = localStorage.getItem('quickLinks')
      if (!localLinks) return
      
      const oldLinks = JSON.parse(localLinks)
      // 检查顺序是否发生变化
      const orderChanged = links.value.some((link, index) => 
        link.id !== oldLinks[index]?.id
      )
      
      // 只有顺序改变时才保存
      if (orderChanged) {
        saveLinks()
      }
    }

    onMounted(() => {
      loadLinks()
    })

    return {
      links,
      showAddDialog,
      newLink,
      addLink,
      deleteLink,
      onDragEnd,
      handleIconError,
      handleUrlInput,
      isValidInput
    }
  }
})
</script>

<style scoped>
.quick-links-container {
  width: 100%;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  position: relative;
}

.content-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.links-wrapper {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  min-height: 40px;
  flex: 1;
}

.link-item {
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 5px 10px;
  border-radius: 4px;
  cursor: move;
  transition: all 0.2s ease;
}

.link-item:hover {
  background-color: rgba(255, 255, 255, 1);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.link-content {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: #333;
  padding: 2px 0;
}

.site-icon {
  width: 16px;
  height: 16px;
  border-radius: 3px;
  object-fit: contain;
}

.site-name {
  font-size: 14px;
  white-space: nowrap;
}

.delete-btn {
  margin-left: 8px;
  cursor: pointer;
  border: none;
  background: none;
  color: #999;
  font-size: 16px;
  padding: 0 4px;
  transition: color 0.2s ease;
}

.delete-btn:hover {
  color: #ff4444;
}

.add-link {
  user-select: none; 
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 4px;
  cursor: pointer;
  font-size: 20px;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.add-link:hover {
  background-color: rgba(255, 255, 255, 1);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog {
  user-select: none; 
  position: absolute;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  bottom: 65px;
  right: 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dialog h3 {
  margin: 0 0 15px 0;
  color: #333;
}

.dialog input {
  width: 100%;
  margin: 10px 0;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.dialog input:focus {
  outline: none;
  border-color: #4a90e2;
}

.dialog-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
}

.dialog-buttons button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.dialog-buttons button:first-child {
  background-color: #4a90e2;
  color: white;
}

.dialog-buttons button:first-child:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.dialog-buttons button:last-child {
  background-color: #f5f5f5;
  color: #666;
}

.dialog-buttons button:hover:not(:disabled) {
  opacity: 0.9;
}
</style> 