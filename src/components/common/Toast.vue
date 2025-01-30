<template>
  <transition name="toast-fade">
    <div v-if="visible" class="toast" :class="type">
      {{ message }}
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const visible = ref(false);
const message = ref('');
const type = ref('info');

const show = (msg: string, msgType: 'success' | 'error' | 'info' = 'info') => {
  message.value = msg;
  type.value = msgType;
  visible.value = true;
  setTimeout(() => {
    visible.value = false;
  }, 3000);
};

// 暴露方法供外部调用
defineExpose({
  show
});
</script>

<style scoped>
.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  border-radius: 4px;
  color: white;
  z-index: 9999;
  min-width: 200px;
  text-align: center;
}

.info {
  background-color: #2196f3;
}

.success {
  background-color: #4caf50;
}

.error {
  background-color: #f44336;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}
</style> 