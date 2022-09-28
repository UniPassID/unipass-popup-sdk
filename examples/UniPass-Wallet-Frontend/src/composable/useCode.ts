import api, { OtpAction } from '@/service/backend'
import { useUniPass } from '@/utils/useUniPass'
import { FormInstance } from 'element-plus'

export function useEmailCode(
  otpAction: OtpAction,
  email: string,
  getToken?: (token: string, type: number) => void,
  atuoFetch = true,
) {
  const { t: $t } = useI18n()
  const unipass = useUniPass()
  // data
  const form = reactive({
    emailCode: '',
    emailCodeLoading: false,
    isFocus: false,
    count: 0,
    token: '',
    loading: false,
  })
  const formElement = ref<FormInstance>()
  // method
  const fetchEmailCode = async () => {
    form.emailCodeLoading = true
    const res = await api.sendOtpCode({
      email,
      action: otpAction,
      authType: 0,
    })
    if (res.ok) {
      form.count = 60
      const n = setInterval(() => {
        form.count--
        if (form.count === 0) {
          clearInterval(n)
        }
      }, 1000)
      unipass.success($t('SendSuccess'))
    }
    form.emailCodeLoading = false
  }
  const verifyEmailCode = () => {
    if (!formElement.value) return
    formElement.value.validate(async (ok) => {
      if (ok) {
        form.loading = true
        const res = await api.verifyOtpCode({
          email,
          action: otpAction,
          code: form.emailCode,
          authType: 0,
        })
        if (res.ok) {
          const token = res.data.upAuthToken
          form.token = token
          if (getToken) getToken(token, 0)
        }
        form.loading = false
      }
    })
  }

  // auto fetch email code
  if (atuoFetch) {
    fetchEmailCode()
  }

  return {
    form,
    formElement,
    fetchEmailCode,
    verifyEmailCode,
  }
}

export function usePhoneCode(email: string, getToken?: (token: string, type: number) => void) {
  const { t: $t } = useI18n()
  const unipass = useUniPass()
  const form = reactive({
    code: '',
    loading: false,
    phoneCodeLoading: false,
    count: 0,
  })
  const fetch = async () => {
    form.phoneCodeLoading = true
    const res = await api.sendOtpCode({
      email,
      action: 'auth2Fa',
      authType: 1,
    })
    if (res.ok) {
      form.count = 60
      const n = setInterval(() => {
        form.count--
        if (form.count === 0) {
          clearInterval(n)
        }
      }, 1000)
      unipass.success($t('SendSuccess'))
      form.phoneCodeLoading = false
    }
  }
  const verify = async () => {
    form.loading = true
    const res = await api.verifyOtpCode({
      email,
      action: 'auth2Fa',
      code: form.code,
      authType: 1,
    })
    if (res.ok) {
      const token = res.data.upAuthToken
      if (getToken) getToken(token, 1)
    }
    form.loading = false
  }
  return {
    form,
    fetch,
    verify,
  }
}

export function useGoogleCode(email: string, getToken?: (token: string, type: number) => void) {
  const form = reactive({
    code: '',
    loading: false,
  })
  const verify = async () => {
    form.loading = true
    const res = await api.verifyOtpCode({
      email,
      action: 'auth2Fa',
      code: form.code,
      authType: 2,
    })
    if (res.ok) {
      const token = res.data.upAuthToken
      if (getToken) getToken(token, 2)
    }
    form.loading = false
    return
  }
  return {
    form,
    verify,
  }
}
