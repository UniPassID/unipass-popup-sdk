import { useKeyPermit, useUniPass } from '@/utils/useUniPass'
import api from '@/service/backend'
import { FormInstance } from 'element-plus'
import { useUserStore } from '@/store/user'
import { SIG_PREFIX } from '@/utils/tss'
import QRCode from 'qrcode'
import { use2FAStore } from '@/store/2FA'

export const useVerifyPhone = () => {
  const unipass = useUniPass()
  const router = useRouter()
  const { t: $t } = useI18n()
  const formElement = ref<FormInstance>()
  const userStore = useUserStore()
  const { phone, init2FA } = use2FAStore()
  init2FA()
  const form = reactive({
    phone: '',
    areaCode: '+1',
    phoneCode: '',
    isPhoneCodeLoading: false,
    isFocus: false,
    count: 0,
    token: '',
    loading: false,
  })

  const fetchPhoneCode = async () => {
    const email = userStore.user.email
    form.isPhoneCodeLoading = true
    const res = await api.sendOtpCode({
      email,
      action: 'bindPhone',
      bindPhone: {
        phone: form.phone,
        areaCode: form.areaCode,
      },
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
    }
    form.isPhoneCodeLoading = false
  }
  const verifyPhoneCode = async () => {
    const user = userStore.user
    const email = user.email

    form.loading = true

    const sessionKeyPermit = await useKeyPermit(user, SIG_PREFIX.BIND_2FA)

    const res = await api.addAuthenticator({
      email,
      sessionKeyPermit,
      type: 1,
      value: JSON.stringify({
        phone: form.phone,
        areaCode: form.areaCode,
      }),
      code: form.phoneCode,
    })
    if (res.ok) {
      const { bind, status } = res.data
      if (bind) {
        phone.bind = bind
        phone.status = status
        router.replace('/setting/2FA/phone')
      }
    }
    form.loading = false
  }

  return {
    form,
    formElement,
    fetchPhoneCode,
    verifyPhoneCode,
  }
}

export const useVerifyGoogle = () => {
  const router = useRouter()
  const userStore = useUserStore()
  const { google, init2FA } = use2FAStore()
  init2FA().then(() => {
    init()
  })
  const form = reactive({
    loading: false,
    code: '',
    secert: '',
    secertQRCode: '',
  })

  const step = ref(1)
  const back = () => {
    if (step.value === 2) {
      step.value = 1
    } else {
      router.back()
    }
  }

  const bindGoogle = async () => {
    const user = userStore.user

    form.loading = true

    const sessionKeyPermit = await useKeyPermit(user, SIG_PREFIX.BIND_2FA)

    const res = await api.addAuthenticator({
      email: user.email,
      sessionKeyPermit,
      type: 2,
      value: form.secert,
      code: form.code,
    })

    if (res.ok) {
      const { bind, status } = res.data
      if (bind) {
        google.bind = bind
        google.status = status
        router.replace('/setting/2FA/google')
      }
    }
    form.loading = false
  }

  const init = async () => {
    const user = userStore.user
    const sessionKeyPermit = await useKeyPermit(user, SIG_PREFIX.BIND_2FA)

    const res = await api.getGoogleAuthenticatorQRCode({
      email: user.email,
      sessionKeyPermit,
    })
    if (res.ok) {
      const { secret } = res.data
      form.secert = secret
      initQRCode(`otpauth://totp/UniPass_${user.email}?secret=${secret}`)
    }
  }
  const initQRCode = async (block: string) => {
    if (!block) {
      return
    }
    // https://www.npmjs.com/package/qrcode#example-1
    form.secertQRCode = await QRCode.toDataURL(block, {
      type: 'image/png',
      width: 105,
      margin: 0,
      // errorCorrectionLevel: 'L',
      color: {
        dark: '#000000',
        light: '#FFFFFF00',
      },
    })
  }

  return {
    step,
    form,
    bindGoogle,
    back,
  }
}
