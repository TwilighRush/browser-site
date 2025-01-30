<template>
  <div 
    class="bookmark-sidebar-trigger"
    @mouseenter="showSidebar"
  >
    <transition name="slide">
      <div 
        v-show="isVisible" 
        class="bookmark-sidebar"
        @mouseleave="hideSidebar"
      >
        <div class="sidebar-header">
          <h3>我的书签</h3>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="搜索书签..."
            class="search-input"
          />
        </div>
        
        <div class="bookmark-tree">
          <BookmarkTreeItem
            v-for="bookmark in filteredBookmarks"
            :key="bookmark.id"
            :item="bookmark"
            @bookmark-updated="loadBookmarks"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { computed } from 'vue'
import BookmarkTreeItem from './BookmarkTreeItem.vue'

export default {
  name: 'BookmarkSidebar',
  components: {
    BookmarkTreeItem
  },
  provide() {
    return {
      sidebarVisible: computed(() => this.isVisible) // 使用 computed 包装以保持响应性
    }
  },
  data() {
    return {
      isVisible: false,
      bookmarks: [],
      searchQuery: ''
    }
  },
  computed: {
    filteredBookmarks() {
      if (!this.searchQuery) return this.bookmarks
      return this.filterBookmarkTree(this.bookmarks, this.searchQuery.toLowerCase())
    }
  },
  mounted() {
    this.loadBookmarks()
  },
  methods: {
    showSidebar() {
      this.isVisible = true
    },
    hideSidebar() {
      this.isVisible = false
    },
    loadBookmarks() {
      if (chrome.bookmarks) {
        chrome.bookmarks.getTree((bookmarkTreeNodes) => {
          if (chrome.runtime.lastError) {
            console.error('加载书签失败:', chrome.runtime.lastError)
            return
          }
          this.bookmarks = this.processBookmarkTree(bookmarkTreeNodes[0].children)
        })
      }
    },
    processBookmarkTree(nodes) {
      return nodes.map(node => {
        const item = {
          id: node.id,
          title: node.title,
          url: node.url
        }
        
        // 如果有子节点，递归处理
        if (node.children) {
          item.children = this.processBookmarkTree(node.children)
        }
        
        return item
      })
    },
    filterBookmarkTree(nodes, query) {
      return nodes.reduce((filtered, node) => {
        if (node.title.toLowerCase().includes(query) || 
            (node.url && node.url.toLowerCase().includes(query))) {
          filtered.push(node)
        } else if (node.children) {
          const filteredChildren = this.filterBookmarkTree(node.children, query)
          if (filteredChildren.length) {
            filtered.push({
              ...node,
              children: filteredChildren
            })
          }
        }
        return filtered
      }, [])
    }
  }
}
</script>

<style scoped>
.bookmark-sidebar-trigger {
  position: fixed;
  top: 0;
  left: 0;
  width: 20px;
  height: 100vh;
  z-index: 999;
}

.bookmark-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 320px;
  height: 100vh;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 24px;
  border-right: 1px solid rgba(0, 0, 0, 0.06);
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}

.sidebar-header {
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  margin-bottom: 20px;
}

.sidebar-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.search-input {
  width: 100%;
  padding: 10px 12px;
  margin-top: 12px;
  border: 1px solid #e4e4e4;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
}

.search-input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

.bookmark-tree {
  height: calc(100% - 90px);
  overflow-y: auto;
  padding: 4px;
}

/* 自定义滚动条样式 */
.bookmark-tree::-webkit-scrollbar {
  width: 6px;
}

.bookmark-tree::-webkit-scrollbar-track {
  background: transparent;
}

.bookmark-tree::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 3px;
}

.bookmark-tree::-webkit-scrollbar-thumb:hover {
  background: #bbb;
}
</style>