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
      />
    </div>

    <!-- 添加右键菜单 -->
    <div v-if="showMenu" class="context-menu" :style="menuPosition">
      <div class="menu-item" @click="editBookmark">编辑</div>
      <div class="menu-item" @click="deleteBookmark">删除</div>
      <div v-if="item.children" class="menu-item" @click="addBookmark">添加书签</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BookmarkTreeItem',
  props: {
    item: {
      type: Object,
      required: true
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
      this.showMenu = true
      this.menuPosition = {
        top: e.clientY + 'px',
        left: e.clientX + 'px'
      }
      e.stopPropagation()
      
      // 点击其他地方关闭菜单
      const closeMenu = () => {
        this.showMenu = false
        document.removeEventListener('click', closeMenu)
      }
      document.addEventListener('click', closeMenu)
    },
    editBookmark() {
      if (this.item.url) {
        chrome.bookmarks.update(this.item.id, {
          title: prompt('新标题', this.item.title),
          url: prompt('新地址', this.item.url)
        })
      }
    },
    deleteBookmark() {
      if (confirm('确定要删除这个书签吗？')) {
        chrome.bookmarks.remove(this.item.id)
      }
    },
    addBookmark() {
      const title = prompt('书签标题')
      const url = prompt('书签地址')
      if (title && url) {
        chrome.bookmarks.create({
          parentId: this.item.id,
          title,
          url
        })
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
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.item-header:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.folder-icon {
  display: inline-block;
  margin-right: 8px;
  transition: transform 0.2s;
  font-size: 12px;
}

.folder-icon.is-open {
  transform: rotate(90deg);
}

.bookmark-icon {
  margin-right: 8px;
  font-size: 12px;
}

.item-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-children {
  padding-left: 20px;
}

.child-item {
  margin-top: 2px;
}

.context-menu {
  position: fixed;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.menu-item {
  padding: 8px 16px;
  cursor: pointer;
}

.menu-item:hover {
  background-color: #f5f5f5;
}
</style> 