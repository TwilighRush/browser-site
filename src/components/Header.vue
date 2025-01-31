<template>
  <header class="fixed top-0 left-0 right-0 h-[60px] bg-transparent z-50">
    <div class="h-full px-5">
      <div class="relative pt-2.5">
        <div class="cursor-pointer w-10" @click="handleAvatarClick">
          <div class="avatar">T</div>
        </div>
      </div>
    </div>

    <!-- 登录弹窗 -->
    <div v-if="showLoginModal" @click.self="showLoginModal = false" 
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000] backdrop-blur-sm">
      <div class="w-[380px] bg-white/95 backdrop-blur rounded-2xl p-8 text-center shadow-2xl transform transition-all duration-300 scale-100">
        <h2 class="text-2xl text-gray-800 font-semibold mb-2">欢迎回来</h2>
        <p class="text-gray-500 text-sm mb-8">请登录您的账号</p>
        <div class="space-y-4">
          <div class="relative">
            <input 
              type="text" 
              v-model="loginForm.username" 
              placeholder="邮箱"
              class="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-gray-100 bg-gray-50/50 
              hover:border-gray-200 hover:bg-gray-50/70
              focus:outline-none focus:border-green-500/20 focus:bg-white 
              focus:ring-[3px] focus:ring-green-500/10 
              focus:shadow-[0_0_0_1px_rgba(34,197,94,0.1)] 
              transition-all duration-200 ease-out 
              placeholder-gray-400 placeholder-opacity-70
              focus:placeholder-opacity-50"
            >
            <div class="absolute inset-y-0 left-3.5 flex items-center text-gray-400 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
          <div class="relative">
            <input 
              type="password" 
              v-model="loginForm.password" 
              placeholder="密码"
              class="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-gray-100 bg-gray-50/50 
              hover:border-gray-200 hover:bg-gray-50/70
              focus:outline-none focus:border-green-500/20 focus:bg-white 
              focus:ring-[3px] focus:ring-green-500/10 
              focus:shadow-[0_0_0_1px_rgba(34,197,94,0.1)] 
              transition-all duration-200 ease-out 
              placeholder-gray-400 placeholder-opacity-70
              focus:placeholder-opacity-50"
            >
            <div class="absolute inset-y-0 left-3.5 flex items-center text-gray-400 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        <button 
          @click="handleLogin"
          class="w-full py-3.5 mt-8 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-green-500/25"
        >
          登录
        </button>
        <div class="mt-6 text-sm text-gray-500">
          还没有账号？ 
          <span @click="switchToRegister" class="text-green-500 font-medium cursor-pointer hover:text-green-600 transition-colors">
            立即注册
          </span>
        </div>
      </div>
    </div>

    <!-- 注册弹窗 -->
    <div v-if="showRegisterModal" @click.self="showRegisterModal = false"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000] backdrop-blur-sm">
      <div class="w-[380px] bg-white/95 backdrop-blur rounded-2xl p-8 text-center shadow-2xl transform transition-all duration-300 scale-100">
        <h2 class="text-2xl text-gray-800 font-semibold mb-2">创建账号</h2>
        <!-- <p class="text-gray-500 text-sm mb-8">加入我们的社区</p> -->
        <div class="space-y-4">
          <div class="relative">
            <input 
              type="text" 
              v-model="registerForm.username" 
              placeholder="邮箱"
              class="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-gray-100 bg-gray-50/50 focus:outline-none focus:border-green-500/20 focus:bg-white focus:ring-[3px] focus:ring-green-500/10 focus:shadow-[0_0_0_1px_rgba(34,197,94,0.1)] transition-all placeholder-gray-400 placeholder-opacity-70 focus:placeholder-opacity-50"
            >
            <div class="absolute inset-y-0 left-3.5 flex items-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
          <div class="relative">
            <input 
              type="password" 
              v-model="registerForm.password" 
              placeholder="密码"
              class="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-gray-100 bg-gray-50/50 focus:outline-none focus:border-green-500/20 focus:bg-white focus:ring-[3px] focus:ring-green-500/10 focus:shadow-[0_0_0_1px_rgba(34,197,94,0.1)] transition-all placeholder-gray-400 placeholder-opacity-70 focus:placeholder-opacity-50"
            >
            <div class="absolute inset-y-0 left-3.5 flex items-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
          <div class="relative">
            <input 
              type="password" 
              v-model="registerForm.confirmPassword" 
              placeholder="确认密码"
              class="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-gray-100 bg-gray-50/50 focus:outline-none focus:border-green-500/20 focus:bg-white focus:ring-[3px] focus:ring-green-500/10 focus:shadow-[0_0_0_1px_rgba(34,197,94,0.1)] transition-all placeholder-gray-400 placeholder-opacity-70 focus:placeholder-opacity-50"
            >
            <div class="absolute inset-y-0 left-3.5 flex items-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        <button 
          @click="handleRegister"
          class="w-full py-3.5 mt-8 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-green-500/25"
        >
          注册
        </button>
        <div class="mt-6 text-sm text-gray-500">
          已有账号？ 
          <span @click="switchToLogin" class="text-green-500 font-medium cursor-pointer hover:text-green-600 transition-colors">
            立即登录
          </span>
        </div>
      </div>
    </div>

    <!-- 设置弹窗 -->
    <div v-if="showSettingsModal" @click.self="showSettingsModal = false"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000] backdrop-blur-sm">
      <div class="w-[380px] bg-white/95 backdrop-blur rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-300 scale-100">
        <div class="px-6 py-5 flex justify-between items-center border-b border-gray-100">
          <h3 class="text-xl font-semibold text-gray-800">设置</h3>
          <button @click="showSettingsModal = false" 
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="divide-y divide-gray-100">
          <div class="px-6 py-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
            </svg>
            <span class="text-gray-700">个人信息</span>
          </div>
          <div class="px-6 py-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
            </svg>
            <span class="text-gray-700">账号设置</span>
          </div>
          <div class="px-6 py-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-50 transition-colors group" @click="handleLogout">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-400 group-hover:text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd" />
            </svg>
            <span class="text-red-500 group-hover:text-red-600">退出登录</span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import request from '../utils/request';
import { useToast } from '../utils/toast';
import { encryptPassword } from '../utils/crypto';

const toast = useToast()

export default {
  name: 'Header',
  data() {
    return {
      userAvatar: 'https://via.placeholder.com/40',
      isLoggedIn: false,
      showLoginModal: false,
      showSettingsModal: false,
      showRegisterModal: false,
      loginForm: {
        username: '',
        password: ''
      },
      registerForm: {
        username: '',
        password: '',
        confirmPassword: ''
      }
    }
  },
  created() {
    // 组件创建时检查登录状态
    this.checkLoginStatus()
  },
  methods: {
    checkLoginStatus() {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')
      
      if (token && user) {
        this.isLoggedIn = true
        const userInfo = JSON.parse(user)
        // 如果有头像信息则更新
        if (userInfo.avatar) {
          this.userAvatar = userInfo.avatar
        }
      }
    },
    handleAvatarClick() {
      if (this.isLoggedIn) {
        this.showSettingsModal = true
      } else {
        this.showLoginModal = true
      }
    },
    switchToRegister() {
      this.showLoginModal = false
      this.showRegisterModal = true
      this.loginForm = { username: '', password: '' }
    },
    switchToLogin() {
      this.showRegisterModal = false
      this.showLoginModal = true
      this.registerForm = { username: '', password: '', confirmPassword: '' }
    },
    validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    },
    validatePassword(password) {
      // 密码长度至少8位
      if (password.length < 8) {
        return { valid: false, message: '密码长度至少8位' }
      }
      
      // 密码必须包含数字和字母
      const hasNumber = /\d/.test(password)
      const hasLetter = /[a-zA-Z]/.test(password)
      
      if (!hasNumber || !hasLetter) {
        return { valid: false, message: '密码必须包含数字和字母' }
      }
      
      return { valid: true }
    },
    async handleLogin() {
      if (!this.validateEmail(this.loginForm.username)) {
        toast.show('请输入有效的邮箱地址', 'error')
        return
      }

      if (!this.loginForm.password) {
        toast.show('请输入密码', 'error')
        return
      }

      try {
        const res = await request('/auth/login', {
          method: 'POST',
          body: JSON.stringify({
            username: this.loginForm.username,
            password: encryptPassword(this.loginForm.password)
          }),
        })
        
        if (res.failed) {
          toast.show(res.message, 'error')
          return
        }

        // 保存token和用户信息
        localStorage.setItem('token', res.token)
        localStorage.setItem('user', JSON.stringify(res.user))
        
        this.isLoggedIn = true
        this.showLoginModal = false
        toast.show('登录成功', 'success')
      } catch (error) {
        toast.show('登录失败: ' + error.message, 'error')
      }
    },
    async handleLogout() {
      try {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        this.isLoggedIn = false
        this.showSettingsModal = false
        this.userAvatar = 'https://via.placeholder.com/40'
        toast.show('已退出登录', 'success')
      } catch (error) {
        toast.show('退出失败: ' + error.message, 'error')
      }
    },
    async handleRegister() {
      if (!this.validateEmail(this.registerForm.username)) {
        toast.show('请输入有效的邮箱地址', 'error')
        return
      }

      const passwordCheck = this.validatePassword(this.registerForm.password)
      if (!passwordCheck.valid) {
        toast.show(passwordCheck.message, 'error')
        return
      }
      
      if (this.registerForm.password !== this.registerForm.confirmPassword) {
        toast.show('两次输入的密码不一致', 'error')
        return
      }

      try {
        const res = await request('/auth/register', {
          method: 'POST',
          body: JSON.stringify({
            username: this.registerForm.username,
            password: encryptPassword(this.registerForm.password)
          }),
        })

        if (res.failed) {
          toast.show(res.message, 'error')
          return
        }

        // 保存token和用户信息
        localStorage.setItem('token', res.token)
        localStorage.setItem('user', JSON.stringify(res.user))

        this.isLoggedIn = true
        this.showRegisterModal = false
        toast.show('注册成功', 'success')
      } catch (error) {
        toast.show('注册失败: ' + error.message, 'error')
      }
    }
  }
}
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: transparent; /* 完全透明背景 */
  z-index: 100;
}

.header-content {
  height: 100%;
  padding: 0 20px;
}

.user-profile {
  position: relative;
  padding-top: 10px; /* 调整头像距离顶部的距离 */
}

.avatar-container {
  cursor: pointer;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-family: Arial;
  font-size: 20px;
  user-select: none; 
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
}

.modal-header {
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
}

.close {
  cursor: pointer;
  font-size: 24px;
}

.modal-body {
  padding: 20px;
}

.modal-body input {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.modal-body button {
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.settings-item {
  padding: 12px 0;
  cursor: pointer;
  border-bottom: 1px solid #eee;
}

.settings-item:last-child {
  border-bottom: none;
}

.settings-item:hover {
  background-color: #f5f5f5;
}

.login-modal {
  padding: 30px;
  width: 320px;
  text-align: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
}

.login-modal h2 {
  margin: 0 0 30px 0;
  color: #333;
  font-weight: 500;
}

.form-group {
  margin-bottom: 20px;
}

.input-minimal {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: #f8f8f8;
}

.input-minimal:focus {
  outline: none;
  border-color: #4CAF50;
  background: white;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.btn-login {
  width: 100%;
  padding: 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-login:hover {
  background-color: #45a049;
}

.register-link {
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}

.register-link span {
  color: #4CAF50;
  cursor: pointer;
  text-decoration: none;
}

.register-link span:hover {
  text-decoration: underline;
}
</style> 