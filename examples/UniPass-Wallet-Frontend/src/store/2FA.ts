import router from '@/plugins/router'
import api from '@/service/backend'
import { useUserStore } from './user'

export const use2FAStore = defineStore({
  id: '2fa',
  state: () => {
    return {
      inited: false,
      phone: {
        bind: false,
        value: '',
        status: 0, // 0:close 1:open
      },
      google: {
        bind: false,
        value: '',
        status: 0, // 0:close 1:open
      },
    }
  },
  actions: {
    async init2FA() {
      if (this.inited) return
      const userStore = useUserStore()
      const user = userStore.user
      const res = await api.authenticatorList({ email: user.email, showAllStatus: true })
      if (res.ok) {
        for (const e of res.data) {
          if (e.type === 1) {
            this.phone.bind = true
            this.phone.value = e.value
            this.phone.status = e.status
          } else if (e.type === 2) {
            this.google.bind = true
            this.google.value = e.value
            this.google.status = e.status
          }
        }
      }
      this.inited = true
    },
    bindPhone() {
      if (!this.inited) return
      if (this.phone.bind) {
        router.push('/setting/2FA/phone')
      } else {
        router.replace('/verify/phone')
      }
    },
    bindGoogle() {
      if (!this.inited) return
      if (this.google.bind) {
        router.push('/setting/2FA/google')
      } else {
        router.replace('/verify/google')
      }
    },
  },
})
