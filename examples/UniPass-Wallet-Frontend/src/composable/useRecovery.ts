import api from '@/service/backend'
import { useRecoveryStore } from '@/store/recovery'
import { ElMessageBox, FormInstance } from 'element-plus'
import dayjs from 'dayjs'
import { User, useUserStore } from '@/store/user'
import db from '@/store/db'
import router from '@/plugins/router'
import { useUniPass } from '@/utils/useUniPass'
import { calculateGuardianWeight, getGuardianEmailData } from '@/utils/rbac'
import { GuardiansStatus } from '@/composable/useGuardian'

export const useRecovery = () => {
  const { t: $t } = useI18n()
  const formElement = ref<FormInstance>()
  // data
  const recoveryStore = useRecoveryStore()

  // methods
  const checkConfirmPassword = (_rule: any, v: string, callback: (err?: Error) => void) => {
    const password = v
    if (recoveryStore.password !== password) {
      return callback(new Error($t('PasswordsNotMatch')))
    }
    callback()
  }

  const submitEmail = () => {
    if (!formElement.value) return
    formElement.value.validate((ok) => {
      if (ok) {
        recoveryStore.step = 2
      }
    })
  }

  const getToken = async (token: string) => {
    recoveryStore.token = token
    recoveryStore.step = 3
  }

  const submitPassword = () => {
    if (!formElement.value) return
    formElement.value.validate(async (ok) => {
      if (ok) {
        recoveryStore.loading = true
        await recoveryStore.uploadCloudKey()
        recoveryStore.loading = false
      }
    })
  }

  // export
  return {
    checkConfirmPassword,
    recoveryStore,
    submitEmail,
    submitPassword,
    formElement,
    getToken,
  }
}

export const useRecoveryGuardian = () => {
  const { t: $t } = useI18n()
  const unipass = useUniPass()
  // data
  const recoveryStore = useRecoveryStore()
  const userStore = useUserStore()
  const form = reactive({
    loading: false,
    guardians: [] as {
      email: string
      emailHash: string
      weight: number
      n: NodeJS.Timer | undefined
      countDown: number
      disbaled: boolean
      status: number
      type: GuardiansStatus
    }[],
  })
  const registerEmail = ref('')
  let polling: NodeJS.Timer | undefined
  let user: User

  const sendEmail = async (i: number) => {
    const upAuthToken = user.stepData
    form.guardians[i].disbaled = true
    const res = await api.sendRecoveryEmail({
      email: user.email,
      upAuthToken,
      verificationEmailHash: form.guardians[i].emailHash,
      newMasterKeyAddress: user.keyset.masterKeyAddress,
    })
    form.guardians[i].disbaled = false
    if (res.ok && form.guardians[i]) {
      form.guardians[i].type = 'pending'
      form.guardians[i].countDown = 60
      form.guardians[i].n = setInterval(() => {
        form.guardians[i].countDown--
        if (form.guardians[i].countDown === 0) {
          clearInterval(form.guardians[i].n)
        }
      }, 1000)
      pollingCheckEmail()
      unipass.success($t('SendSuccess'))
    }
  }

  const startRecovery = async () => {
    const verificationEmailHashs = recoveryStore.verificationEmailHashs
    if (verificationEmailHashs.length == 0) return

    if (recoveryStore.canSendStartRecoveryTx) {
      if (recoveryStore.isHaveTimeLock) {
        ElMessageBox.confirm($t('ResetPasswordTip'), $t('Notification'), {
          showClose: false,
        })
          .then(() => {
            recovery()
          })
          .catch(() => {})
      } else {
        recovery()
      }
    }
  }

  const recovery = async () => {
    const verificationEmailHashs = recoveryStore.verificationEmailHashs
    form.loading = true
    const res = await api.startRecovery({
      email: user.email,
      verificationEmailHashs,
    })
    if (res.ok) {
      pollingCheckEmail(2)
    }
  }

  const pollingCheckEmail = async (time = 30) => {
    if (polling) return

    const date = dayjs().add(time, 'minute')
    polling = setInterval(async () => {
      const res = await api.sendRecoveryStatus(user.email)
      const verificationEmailHashs: string[] = []

      if (res.ok) {
        for (const e of res.data) {
          const i = form.guardians.findIndex((guardian) => guardian.emailHash === e.emailHash)
          if (i !== -1) {
            form.guardians[i].status = e.status
            if (e.status === 1 && form.guardians[i].type !== 'success') {
              form.guardians[i].type = 'success'
            }
          }
          if (e.status === 2) {
            clearInterval(polling)
            polling = undefined

            await db.delUser(user.email)
            // reset recoveryStore
            recoveryStore.$reset()
            router.replace({
              path: '/recovery/loading',
              query: { address: user.account, haveTime: 'true' },
            })
            form.loading = false
            break
          }
          if (e.status === 1 || e.status == 2) {
            verificationEmailHashs.push(form.guardians[i].emailHash)
          }
          recoveryStore.verificationEmailHashs = verificationEmailHashs
        }

        const sendRecoveryAction = calculateGuardianWeight(
          user.keyset.keysetJson,
          recoveryStore.verificationEmailHashs,
        )
        recoveryStore.isHaveTimeLock = sendRecoveryAction.isHaveTimeLock
        recoveryStore.canSendStartRecoveryTx = sendRecoveryAction.canSendStartRecoveryTx
      }
      // timeout
      if (date.isBefore(dayjs())) {
        clearInterval(polling)
        ElMessageBox.alert($t('RecoveryRestart'), $t('RecoveryTimeout'), {
          confirmButtonText: $t('Confirm'),
          showClose: false,
        }).then(() => {
          // clear password
          recoveryStore.password = ''
          recoveryStore.confirmPassword = ''
          recoveryStore.step = 1
        })
      }
    }, 4000)
  }

  onBeforeMount(async () => {
    if (userStore.user.step === 'recovery') {
      user = userStore.user
      const guardianEmail = getGuardianEmailData(user.keyset.keysetJson)
      form.guardians = guardianEmail.map((item) => {
        return {
          ...item,
          countDown: 0,
          n: undefined,
          disbaled: false,
          status: 0,
          type: 'send',
        }
      })
      registerEmail.value = user.email
      init()
    } else {
      // clear password
      recoveryStore.password = ''
      recoveryStore.confirmPassword = ''
      recoveryStore.step = 1
    }
  })

  onUnmounted(() => {
    clearInterval(polling)
  })

  const show2FA = ref(false)
  const verify2FA = ref('')
  const init = async () => {
    const res = await api.authenticatorList({ email: recoveryStore.email, showAllStatus: true })
    if (res.ok) {
      for (const e of res.data) {
        if (e.status === 1) {
          if (e.type === 1) {
            verify2FA.value = 'need'
            return
          } else if (e.type === 2) {
            verify2FA.value = 'need'
            return
          }
        }
      }
    }
    if (form.guardians.length === 1) {
      verify2FA.value = 'success'
    }
  }

  return {
    form,
    sendEmail,
    startRecovery,
    pollingCheckEmail,
    registerEmail,
    verify2FA,
    show2FA,
  }
}
