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
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import BookmarkTreeItem from './BookmarkTreeItem.vue'

export default {
  name: 'BookmarkSidebar',
  components: {
    BookmarkTreeItem
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
      // 使用 Chrome Bookmarks API 获取书签树
      if (chrome.bookmarks) {
        console.log('======',chrome.bookmarks)
        chrome.bookmarks.getTree((bookmarkTreeNodes) => {
          // bookmarkTreeNodes[0] 是根节点
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
  width: 300px;
  height: 100vh;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 20px;
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
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
  margin-bottom: 16px;
}

.bookmark-tree {
  height: calc(100% - 60px);
  overflow-y: auto;
  padding: 8px;
}

.search-input {
  width: 100%;
  padding: 8px;
  margin-top: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}
</style>