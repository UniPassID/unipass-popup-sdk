import { useUserStore, User } from '@/store/user'
import { ElMessageBox, ElMessage } from 'element-plus'
import { emailDotPrompt, emailLowercaseFormat, emailLowercasePrompt } from '@/utils/email-dict'
import UpIcon from '@/components/up-icon.vue'
import { signMsg } from './cloud-key'
import { decryptSessionKey } from './session-key'

export const upSuccess = (message: string) => {
  ElMessage({
    message,
    type: 'success',
    icon: h(UpIcon, { name: 'success' }),
    // duration: 0,
    center: true,
    customClass: 'up-message-success',
    grouping: true,
  })
}

export const upError = (message: string) => {
  ElMessage({
    message,
    type: 'error',
    icon: h(UpIcon, { name: 'wrong' }),
    // duration: 0,
    customClass: 'up-message-error',
    grouping: true,
  })
}

export const useUniPass = () => {
  const { t: $t } = useI18n()
  const userStore = useUserStore()
  const { copy: $copy } = useClipboard()

  const copy = (str: string) => {
    $copy(str)
    upSuccess($t('CopySuccess'))
  }

  // format
  const formatAddress = (address: string) => {
    if (!address) {
      return ''
    }
    const prefix = address.slice(0, 6)
    const suffix = address.slice(-4)
    return prefix + '...' + suffix
  }
  const formatEmail = (email: string, next = false) => {
    for (const s of [' ', '+']) {
      email = email.replaceAll(s, '')
    }
    const i = email.indexOf('@')
    if (i !== -1) {
      let prefix = email.slice(0, i)
      let warning = ''
      const suffix = email
        .slice(i + 1)
        .replaceAll('@', '')
        .toLowerCase()
      if (/[A-Z]/.test(prefix)) {
        if (emailLowercaseFormat.includes(suffix)) {
          prefix = prefix.toLowerCase()
        }
        if (emailLowercasePrompt.includes(suffix)) {
          if (prefix.includes('.') && emailDotPrompt.includes(suffix)) {
            warning = $t('SameCaseDot')
          } else {
            warning = $t('SameCase')
          }
        }
      }
      if (prefix.includes('.')) {
        if (emailDotPrompt.includes(suffix) && !warning) {
          warning = $t('SameDot')
        }
      }
      if (next) {
        return warning
      }

      email = prefix + '@' + suffix
    }
    return email
  }
  const formatPassword = (password: string) => {
    const re = /[^A-z\d!"#$%&\\'()*+,-./:;<=>?@[\]^_`{|}~]/g
    return password.replaceAll(re, '')
  }

  // check
  const checkEmailFormat = (_rule: any, v: string, callback: (err?: Error) => void) => {
    const email = v
    if (!email) {
      // return callback(new Error($t('EmailEmpty')))
      return callback()
    }
    const regex = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
    if (!regex.test(email)) {
      return callback(new Error($t('EmailWrongFormat')))
    }
    if (userStore.mailServices.length === 0) {
      return callback(new Error($t('NetworkError')))
    }
    let ok = false
    for (const e of userStore.mailServices) {
      if (email.endsWith('@' + e)) {
        ok = true
      }
    }
    if (!ok) {
      userStore.showSupportEmail = true
      return callback(new Error($t('NotSupport')))
    }
    callback()
  }
  const checkPassword = (_rule: any, v: string, callback: (err?: Error) => void) => {
    const password = v
    if (!password) {
      return callback(new Error($t('PasswordEmpty')))
    }
    if (/^\S{8,32}$/.test(password) === false) {
      return callback(new Error($t('PasswordRule1')))
    }
    if (/(?=.*[A-Z])(?=.*\S)[^]/.test(password) === false) {
      return callback(new Error($t('PasswordRule2')))
    }
    if (/(?=[a-z])[^]/.test(password) === false) {
      return callback(new Error($t('PasswordRule3')))
    }
    if (/(?=[\d]+)/.test(password) === false) {
      return callback(new Error($t('PasswordRule4')))
    }
    callback()
  }

  const userExit = () => {
    ElMessageBox.confirm($t('SureLogOut'), $t('LogOutAccount'), {
      confirmButtonText: $t('LogOut'),
      cancelButtonText: $t('Cancel'),
    })
      .then(() => {
        userStore.exit(true)
      })
      .catch(() => {})
  }

  return {
    checkEmailFormat,
    checkPassword,
    formatAddress,
    formatEmail,
    formatPassword,
    copy,
    success: upSuccess,
    error: upError,
    userExit,
  }
}

export const useKeyPermit = async (user: User, msg: string) => {
  const timestamp = user.sessionKey.expires
  const sessionKeyAddress = user.sessionKey.localKey.address
  const permit = user.sessionKey.authorization
  const sessionKeyPrivateKey = await decryptSessionKey(
    user.sessionKey.aesKey,
    user.sessionKey.localKey.keystore,
  )
  const sig = await signMsg(msg + timestamp, sessionKeyPrivateKey, false)
  const weight = Number(process.env.VUE_APP_Permit_Weight)

  const sessionKeyPermit = {
    timestamp: timestamp,
    timestampNow: timestamp,
    permit,
    sessionKeyAddress,
    sig,
    weight,
  }
  return sessionKeyPermit
}

export type TransactionType = 'send-token' | 'token-approval' | 'contract-call'
