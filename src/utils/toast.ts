import { App, createVNode, render } from 'vue'
import Toast from '../components/Toast.vue'

export interface ToastInstance {
  show: (message: string, type?: 'success' | 'error' | 'info') => void
}

let toastInstance: ToastInstance | null = null

export const useToast = () => {
  if (!toastInstance) {
    const container = document.createElement('div')
    const vnode = createVNode(Toast)
    render(vnode, container)
    document.body.appendChild(container)
    toastInstance = vnode.component?.exposed as ToastInstance
  }
  return toastInstance
}

export const toast = {
  install(app: App) {
    app.config.globalProperties.$toast = useToast()
  },
}
