import { useRegisterStore } from '@/store/register'
import { FormInstance } from 'element-plus'

import dayjs from 'dayjs'
import db from '@/store/db'
import blockchain from '@/service/blockchain'
import { useUserStore } from '@/store/user'
import { useUniPass } from '@/utils/useUniPass'
import { generateKdfPassword } from '@/utils/cloud-key'

export const useRegister = () => {
  const { t: $t } = useI18n()
  const formElement = ref<FormInstance>()
  const unipass = useUniPass()
  const showWarning = ref(false)

  // data
  const registerStore = useRegisterStore()
  // methods
  const checkConfirmPassword = (_rule: any, v: string, callback: (err?: Error) => void) => {
    const password = v
    if (!password) {
      return callback()
    }
    if (registerStore.password !== password) {
      return callback(new Error($t('PasswordsNotMatch')))
    }
    callback()
  }
  const submit = () => {
    if (!formElement.value) return
    formElement.value.validate((ok) => {
      if (ok) {
        const warning = unipass.formatEmail(registerStore.email, true)
        if (warning) {
          showWarning.value = true
        } else {
          registerStore.step = 2
        }
      }
    })
  }
  const getToken = async (token: string) => {
    registerStore.token = token
    checkMold()
  }
  const moldPassword = () => {
    if (!formElement.value) return
    formElement.value.validate(async (ok) => {
      if (ok) {
        registerStore.isFocus = false
        registerStore.kdfPassword = generateKdfPassword(registerStore.password)
        checkMold()
      }
    })
  }

  const checkMold = async () => {
    if (registerStore.kdfPassword && registerStore.token) {
      await registerStore.register()
    }
  }

  // export
  return {
    moldPassword,
    unipass,
    showWarning,
    registerStore,
    checkConfirmPassword,
    submit,
    formElement,
    getToken,
  }
}

export const useRegisterLoading = () => {
  const { t: $t } = useI18n()
  const unipass = useUniPass()
  const router = useRouter()
  const route = useRoute()
  const email = (route.query.email as string) || ''
  let polling: NodeJS.Timer | undefined
  onBeforeMount(async () => {
    if (email) {
      const user = await db.getUser(email)
      if (user) {
        const date = dayjs().add(2, 'minute')
        polling = setInterval(async () => {
          const registered = await blockchain.isRegistered(user.account)
          if (registered) {
            clearInterval(polling)
            // register success
            user.committed = true
            delete user.step
            delete user.stepData
            const userStore = useUserStore()
            await userStore.update(user)
            localStorage.setItem('email', user.email)
            router.replace(userStore.path || '/')
          }
          // timeout
          if (date.isBefore(dayjs())) {
            clearInterval(polling)
            unipass.error($t('RegisterTimeout'))
          }
        }, 4000)
      } else {
        router.replace('/register')
      }
    } else {
      router.replace('/register')
    }
  })
  onUnmounted(() => {
    clearInterval(polling)
  })
}
