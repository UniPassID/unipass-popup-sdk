import api from '@/service/backend'
import { generateKdfPassword } from '@/utils/cloud-key'
import { FormInstance } from 'element-plus'
import { useLoginStore } from '@/store/login'
import router from '@/plugins/router'
import { useUniPass } from '@/utils/useUniPass'

import { useEmailCode, usePhoneCode, useGoogleCode } from '@/composable/useCode'

export const useLogin = () => {
  // data
  const { t: $t } = useI18n()
  const formElement = ref<FormInstance>()
  const loginStore = useLoginStore()
  const unipass = useUniPass()

  const submit = () => {
    if (!formElement.value) return
    formElement.value.validate(async (ok) => {
      if (ok) {
        loginStore.loading = true
        const kdfPassword = generateKdfPassword(loginStore.password)
        const res = await api.getPasswordToken({
          email: loginStore.email,
          kdfPassword,
          captchaToken: '',
        })
        loginStore.loading = false
        if (res.ok) {
          const { upAuthToken, showCaptcha, pending, address } = res.data
          if (pending) {
            // clear password
            loginStore.password = ''
            router.push({
              path: '/recovery/loading',
              query: { address },
            })
            return
          }
          if (showCaptcha) {
            // todo showCaptcha
            console.log('showCaptcha', showCaptcha)
          }
          if (upAuthToken) {
            loginStore.token = upAuthToken
            loginStore.step = 2
          } else {
            unipass.error($t('IncorrectMailOrPassword'))
          }
        }
      }
    })
  }

  return {
    loginStore,
    formElement,
    submit,
  }
}

export interface Props {
  email?: string
}

export interface Emits {
  (event: 'back'): void
  (event: 'token', token: string, type: number): void
}

export const useLoginVerify = (props: Props, $emit: Emits) => {
  const loginStore = useLoginStore()
  const isDark = useDark()

  // computed
  const disabled = computed(() => {
    if (twoStep.active === 'google') {
      return !google.form.code
    } else if (twoStep.active === 'phone') {
      return !phone.form.code
    } else {
      return !email.form.emailCode
    }
  })
  const loading = computed(() => {
    if (loginLoading.value) {
      return true
    } else if (twoStep.active === 'google') {
      return google.form.loading
    } else if (twoStep.active === 'phone') {
      return phone.form.loading
    } else {
      return email.form.loading
    }
  })
  const twoStep = reactive({
    email: loginStore.email,
    phone: '',
    google: '',
    active: 'email',
  })
  const showEmail = computed(() => {
    if (props.email) {
      return false
    }
    return Boolean(twoStep.phone || twoStep.google)
  })
  const showGoogle = computed(() => {
    if (props.email && !twoStep.phone) {
      return false
    }
    return twoStep.google
  })
  const showPhone = computed(() => {
    if (props.email && !twoStep.google) {
      return false
    }
    return twoStep.phone
  })

  // login
  const submit = () => {
    if (twoStep.active === 'google') {
      google.verify()
    } else if (twoStep.active === 'phone') {
      phone.verify()
    } else {
      email.verifyEmailCode()
    }
  }
  const loginLoading = ref(false)
  const login = async (token: string, type: number) => {
    if (props.email) {
      $emit('token', token, type)
      return
    }
    loginLoading.value = true
    const res = await api.login({
      email: loginStore.email,
      upAuthToken: loginStore.token,
      auth2FaToken: [
        {
          type,
          upAuthToken: token,
        },
      ],
    })
    if (res.ok) {
      await loginStore.login(
        res.data.keystore,
        res.data.address,
        res.data.localKeyAddress,
        res.data.upAuthToken,
      )
    }
    loginLoading.value = false
  }

  const registerEmail = props.email || loginStore.email
  const email = useEmailCode('auth2Fa', registerEmail, login, false)
  const google = useGoogleCode(registerEmail, login)
  const phone = usePhoneCode(registerEmail, login)
  const formElement = email.formElement

  const init = async () => {
    const res = await api.authenticatorList({
      email: registerEmail,
      showAllStatus: true,
    })
    if (res.ok) {
      for (const e of res.data) {
        if (e.status === 1) {
          if (e.type === 1) {
            twoStep.phone = e.value
            twoStep.active = 'phone'
          } else if (e.type === 2) {
            twoStep.google = e.value
            twoStep.active = 'google'
          }
        }
      }
    }
  }

  init()

  return {
    isDark,
    formElement,
    loading,
    disabled,
    submit,
    showEmail,
    showGoogle,
    showPhone,
    twoStep,
    email,
    google,
    phone,
    loginStore,
  }
}
