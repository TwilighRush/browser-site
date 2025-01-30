<template>
  <div class="bookmark-tree-item">
    <div 
      class="item-header"
      @click="toggleFolder"
      @contextmenu.prevent="showContextMenu"
    >
      <i 
        v-if="item.children" 
        class="folder-icon"
        :class="{ 'is-open': isOpen }"
      >▶</i>
      <i v-else class="bookmark-icon">🔖</i>
      <span class="item-title">{{ item.title }}</span>
    </div>
    
    <div v-if="item.children" class="item-children" v-show="isOpen">
      <BookmarkTreeItem
        v-for="child in item.children"
        :key="child.id"
        :item="child"
        class="child-item"
        @bookmark-updated="$emit('bookmark-updated')"
      />
    </div>

    <!-- 修改右键菜单，添加动画类名 -->
    <div v-if="showMenu" class="context-menu menu-animation" :style="menuPosition">
      <div class="menu-item" data-action="edit" @click="editBookmark">编辑</div>
      <div class="menu-item" data-action="delete" @click="deleteBookmark">删除</div>
      <div v-if="item.children" class="menu-item" data-action="add-bookmark" @click="addBookmark">添加书签</div>
      <div v-if="item.children" class="menu-item" data-action="add-folder" @click="addFolder">新建文件夹</div>
    </div>
  </div>
</template>

<script>
// 使用一个全局变量来跟踪当前打开的菜单
let currentOpenMenu = null

export default {
  name: 'BookmarkTreeItem',
  inject: ['sidebarVisible'],
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  watch: {
    // 监听侧边栏的可见性
    'sidebarVisible.value': {
      handler(newValue) {
        // 当侧边栏关闭时，关闭右键菜单
        if (!newValue && this.showMenu) {
          this.showMenu = false
          currentOpenMenu = null
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      isOpen: false,
      showMenu: false,
      menuPosition: {
        top: '0px',
        left: '0px'
      }
    }
  },
  methods: {
    toggleFolder() {
      if (this.item.children) {
        this.isOpen = !this.isOpen
      } else if (this.item.url) {
        window.open(this.item.url, '_blank')
      }
    },
    showContextMenu(e) {
      // 如果有其他打开的菜单，先关闭它
      if (currentOpenMenu && currentOpenMenu !== this) {
        currentOpenMenu.showMenu = false
      }
      
      // 记录当前打开的菜单
      currentOpenMenu = this
      this.showMenu = true

      // 在下一个事件循环中获取菜单尺寸
      this.$nextTick(() => {
        const menu = e.target.closest('.bookmark-tree-item').querySelector('.context-menu')
        if (!menu) return

        const menuHeight = menu.offsetHeight
        const menuWidth = menu.offsetWidth
        
        // 获取视窗尺寸
        const viewportHeight = window.innerHeight
        const viewportWidth = window.innerWidth
        
        // 计算合适的位置
        let top = e.clientY
        let left = e.clientX

        // 检查底部边界，如果超出则向上显示
        if (top + menuHeight > viewportHeight) {
          top = top - menuHeight
        }

        // 检查右侧边界
        if (left + menuWidth > viewportWidth) {
          left = left - menuWidth
        }

        // 确保不会超出顶部
        if (top < 0) {
          top = 0
        }

        // 确保不会超出左侧
        if (left < 0) {
          left = 0
        }

        this.menuPosition = {
          top: `${top}px`,
          left: `${left}px`
        }
      })

      e.stopPropagation()
      
      // 点击其他地方关闭菜单
      const closeMenu = () => {
        this.showMenu = false
        currentOpenMenu = null
        document.removeEventListener('click', closeMenu)
      }
      document.addEventListener('click', closeMenu)
    },
    async editBookmark() {
      try {
        const newTitle = prompt('新标题', this.item.title)
        if (!newTitle) return

        if (this.item.url) {
          // 如果是书签，则同时编辑 URL
          const newUrl = prompt('新地址', this.item.url)
          if (!newUrl) return

          // 验证 URL 格式
          let validUrl = newUrl
          if (!newUrl.startsWith('http://') && !newUrl.startsWith('https://')) {
            validUrl = 'https://' + newUrl
          }

          // 更新书签
          await new Promise((resolve, reject) => {
            chrome.bookmarks.update(this.item.id, {
              title: newTitle,
              url: validUrl
            }, (result) => {
              if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError)
              } else {
                resolve(result)
                this.$emit('bookmark-updated')
              }
            })
          })
        } else {
          // 如果是文件夹，只更新标题
          await new Promise((resolve, reject) => {
            chrome.bookmarks.update(this.item.id, {
              title: newTitle
            }, (result) => {
              if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError)
              } else {
                resolve(result)
                this.$emit('bookmark-updated')
              }
            })
          })
        }
      } catch (error) {
        console.error('编辑失败:', error)
        alert('编辑失败: ' + error.message)
      }
    },
    async deleteBookmark() {
      if (confirm('确定要删除这个书签吗？')) {
        try {
          // 使用 Promise 包装 chrome.bookmarks.remove
          await new Promise((resolve, reject) => {
            chrome.bookmarks.remove(this.item.id, () => {
              if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError)
              } else {
                resolve()
                // 通知父组件刷新书签列表
                this.$emit('bookmark-updated')
              }
            })
          })
        } catch (error) {
          console.error('删除书签失败:', error)
          alert('删除书签失败: ' + error.message)
        }
      }
    },
    async addBookmark() {
      try {
        const title = prompt('书签标题')
        if (!title) return

        const url = prompt('书签地址')
        if (!url) return

        // 验证 URL 格式
        let validUrl = url
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          validUrl = 'https://' + url
        }

        // 使用 Promise 包装 chrome.bookmarks.create
        await new Promise((resolve, reject) => {
          chrome.bookmarks.create({
            parentId: this.item.id,
            title: title,
            url: validUrl
          }, (result) => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError)
            } else {
              resolve(result)
              // 通知父组件刷新书签列表
              this.$emit('bookmark-updated')
            }
          })
        })

        // 成功后自动展开文件夹
        this.isOpen = true
        
      } catch (error) {
        console.error('添加书签失败:', error)
        alert('添加书签失败: ' + error.message)
      }
    },
    async addFolder() {
      try {
        const title = prompt('文件夹名称')
        if (!title) return

        // 使用 Promise 包装 chrome.bookmarks.create
        await new Promise((resolve, reject) => {
          chrome.bookmarks.create({
            parentId: this.item.id,
            title: title,
            // 不设置 url 属性，Chrome 会将其视为文件夹
          }, (result) => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError)
            } else {
              resolve(result)
              // 通知父组件刷新书签列表
              this.$emit('bookmark-updated')
            }
          })
        })

        // 成功后自动展开文件夹
        this.isOpen = true
        
      } catch (error) {
        console.error('创建文件夹失败:', error)
        alert('创建文件夹失败: ' + error.message)
      }
    }
  }
}
</script>

<style scoped>
.bookmark-tree-item {
  font-size: 14px;
}

.item-header {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  margin: 2px 0;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
  color: #333;
}

.item-header:hover {
  background-color: rgba(0, 0, 0, 0.04);
  transform: translateX(2px);
}

.folder-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  width: 16px;
  height: 16px;
  color: #666;
  transition: transform 0.2s ease;
}

.folder-icon.is-open {
  transform: rotate(90deg);
  color: #4a90e2;
}

.bookmark-icon {
  margin-right: 10px;
  font-size: 14px;
  opacity: 0.7;
}

.item-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
}

.item-children {
  padding-left: 24px;
  margin-left: 4px;
  border-left: 1px solid rgba(0, 0, 0, 0.06);
}

.child-item {
  margin-top: 2px;
}

.context-menu {
  position: fixed;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  padding: 6px;
  min-width: 160px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(10px);
  /* 删除过渡效果，添加展开动画 */
  transform-origin: top left;
  animation: scaleIn 0.15s ease-out forwards;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.menu-item {
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
  color: #333;
  font-weight: 500;
  margin: 2px 0;
}

.menu-item:hover {
  background-color: #f5f7fa;
  color: #4a90e2;
}

/* 可选：为文件夹操作添加图标 */
.menu-item::before {
  margin-right: 8px;
  opacity: 0.7;
}

.menu-item[data-action="edit"]::before {
  content: "✏️";
}

.menu-item[data-action="delete"]::before {
  content: "🗑️";
}

.menu-item[data-action="add-bookmark"]::before {
  content: "🔖";
}

.menu-item[data-action="add-folder"]::before {
  content: "📁";
}
</style> 