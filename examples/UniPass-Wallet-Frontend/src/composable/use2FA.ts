import api from '@/service/backend'
import { use2FAStore } from '@/store/2FA'
import { useUserStore } from '@/store/user'
import { SIG_PREFIX } from '@/utils/tss'
import { useKeyPermit } from '@/utils/useUniPass'

export const use2faPhone = () => {
  const userStore = useUserStore()

  const { phone, init2FA } = use2FAStore()
  init2FA().then(() => {
    form.open = phone.status === 1
  })
  const form = reactive({
    open: phone.status === 1,
    loading: false,
  })
  const changeStatus = async () => {
    const user = userStore.user
    form.loading = true
    const sessionKeyPermit = await useKeyPermit(user, SIG_PREFIX.UPDATE_2FA)
    const res = await api.authenticatorStatus({
      email: user.email,
      sessionKeyPermit,
      type: 1,
      status: form.open ? 0 : 1,
    })
    form.loading = false
    if (!res.ok) {
      return false
    }
    return true
  }
  const beforeChange = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      changeStatus().then((ok: boolean) => {
        if (ok) {
          resolve(true)
        } else {
          reject(false)
        }
      })
    })
  }

  return {
    form,
    beforeChange,
  }
}

export const use2faGoogle = () => {
  const userStore = useUserStore()

  const { google, init2FA } = use2FAStore()
  init2FA().then(() => {
    form.open = google.status === 1
  })
  const form = reactive({
    open: google.status === 1,
    loading: false,
  })
  const changeStatus = async () => {
    const user = userStore.user
    form.loading = true
    const sessionKeyPermit = await useKeyPermit(user, SIG_PREFIX.UPDATE_2FA)
    const res = await api.authenticatorStatus({
      email: user.email,
      sessionKeyPermit,
      type: 2,
      status: form.open ? 0 : 1,
    })
    form.loading = false
    if (!res.ok) {
      return false
    }
    return true
  }
  const beforeChange = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      changeStatus().then((ok: boolean) => {
        if (ok) {
          resolve(true)
        } else {
          reject(false)
        }
      })
    })
  }

  return {
    form,
    beforeChange,
  }
}
