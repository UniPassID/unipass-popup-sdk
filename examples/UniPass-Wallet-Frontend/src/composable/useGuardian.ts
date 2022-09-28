import { Wallet } from 'ethers'
import api, { GuardianData } from '@/service/backend'
import blockchain from '@/service/blockchain'
import { useUserStore } from '@/store/user'
import { generateKdfPassword, signMsg } from '@/utils/cloud-key'
import { getAccountKeysetJson, hideSecurityInformation, sha256Hash } from '@/utils/rbac'
import { decryptSessionKey } from '@/utils/session-key'
import Tss, { SIG_PREFIX } from '@/utils/tss'
import { useUniPass } from '@/utils/useUniPass'
import { ElMessageBox, FormInstance } from 'element-plus'
import { UpdateKeysetHashTxBuilder } from '@unipasswallet/transaction-builders'
import { KeyEmailDkim, KeySecp256k1, Keyset } from '@unipasswallet/keys'
import dayjs from 'dayjs'
import db from '@/store/db'
export type GuardiansStatus = 'send' | 'pending' | 'success' | 'error'
export type AuthType = 'delete' | 'add'
export interface GuardiansInfo {
  recoveryEmail: string
  type: GuardiansStatus
  added: boolean
  count: number
  loading: boolean
  isSelfGuardian: boolean
  n: any
  // hash
  emailHash: string
  pepper: string
}

export const useGuardian = () => {
  const router = useRouter()
  const { t: $t } = useI18n()
  const userStore = useUserStore()
  const formElement = ref<FormInstance>()
  const authElement = ref<FormInstance>()
  const unipass = useUniPass()
  const form = reactive({
    isDelete: false,
    show: false,
    email: '',
    loading: false,
    guardians: [] as GuardiansInfo[],
    guardiansBackup: '',
    // keyset
    keysetJson: '',
    hash: '',
  })
  const auth = reactive({
    type: '' as AuthType,
    show: false,
    password: '',
    loading: false,
  })

  const submitDisabled = computed(
    () => form.guardians.map((e) => e.recoveryEmail).join(',') === form.guardiansBackup,
  )

  let polling: NodeJS.Timer | undefined
  const pollingCheckEmail = async (time = 30) => {
    const user = userStore.user
    if (polling) return

    const date = dayjs().add(time, 'minute')
    polling = setInterval(async () => {
      const res = await api.getGuardianToken(user.email)
      if (res.ok) {
        for (const e of res.data) {
          for (let i = 0; i < form.guardians.length; i++) {
            const guardian = form.guardians[i]
            if (guardian.recoveryEmail === e.email && e.verified) {
              if (form.guardians[i].type !== 'success') {
                form.guardians[i].type = 'success'
              }
            }
          }
          if (res.data.every((e) => e.verified)) {
            clearInterval(polling)
            polling = undefined
          }
        }
      }
      // timeout
      if (date.isBefore(dayjs())) {
        clearInterval(polling)
        polling = undefined
        ElMessageBox.alert($t('RecoveryRestart'), $t('RecoveryTimeout'), {
          confirmButtonText: $t('Confirm'),
          showClose: false,
        }).then(() => {
          //
        })
      }
    }, 4000)
  }

  const sendLink = (index: number) => {
    if (!formElement.value) return
    formElement.value.validate(async (ok) => {
      if (ok) {
        const user = userStore.user
        if (
          form.guardians.find((e) => e.recoveryEmail === form.email) ||
          form.email === user.email
        ) {
          unipass.error($t('HaveAdded'))
          return
        }

        const i = index === -1 ? form.guardians.length : index
        const email = index === -1 ? form.email : form.guardians[i].recoveryEmail
        form.loading = true
        const res = await api.sendGuardianLink({
          email,
          registerEmail: user.email,
        })
        form.loading = false

        if (res.ok) {
          if (form.guardians.find((e) => e.recoveryEmail === email) === undefined) {
            const pepper = Wallet.createRandom().privateKey
            form.guardians.push({
              recoveryEmail: email,
              type: 'send',
              added: false,
              n: 0,
              count: 60,
              loading: false,
              isSelfGuardian: false,
              emailHash: sha256Hash(email, pepper),
              pepper,
            })
          }
          form.guardians[i].type = 'pending'
          form.guardians[i].count = 60
          form.guardians[i].n = setInterval(() => {
            if (form.guardians[i]) {
              form.guardians[i].count--
              if (form.guardians[i].count === 0) {
                clearInterval(form.guardians[i].n)
              }
            }
          }, 1000)
          pollingCheckEmail()
          unipass.success($t('SendSuccess'))

          form.email = ''
          form.show = false
        }
      }
    })
  }
  const checkHash = (hash: string) => {
    const date = dayjs().add(2, 'minute')
    polling = setInterval(async () => {
      const res = await blockchain.getTransactionReceipt(hash)
      if (res) {
        const user = await db.getUser(userStore.user.email)
        if (!user) {
          console.error('user not found')
          return
        }
        // update guardian success
        user.keyset.hash = form.hash
        user.keyset.keysetJson = form.keysetJson
        user.keyset.keysetJson = hideSecurityInformation(form.keysetJson)
        userStore.update(user)
        clearInterval(polling)
        polling = undefined
        auth.password = ''
        auth.show = false
        if (auth.type === 'delete') {
          for (const e of deleteChecked.value) {
            const i = form.guardians.findIndex((item) => item.recoveryEmail === e)
            if (i !== -1) {
              clearInterval(form.guardians[i].n)
              form.guardians.splice(i, 1)
            }
          }
          deleteChecked.value = []
          unipass.success($t('DeleteSuccess'))
          form.isDelete = false
        } else {
          unipass.success($t('AddSuccess'))
        }
        for (let i = 0; i < form.guardians.length; i++) {
          const guardian = form.guardians[i]
          guardian.added = true
        }
        // delete
        form.guardiansBackup = form.guardians.map((e) => e.recoveryEmail).join(',')
        auth.loading = false
      }
      // timeout
      if (date.isBefore(dayjs())) {
        clearInterval(polling)
        polling = undefined
        unipass.error($t('RegisterTimeout'))
        auth.loading = false
      }
    }, 4000)
  }

  const authentication = () => {
    if (!authElement.value) return
    authElement.value.validate(async (ok) => {
      if (ok) {
        auth.loading = true
        let guardians = []
        if (auth.type === 'delete') {
          guardians = JSON.parse(JSON.stringify(form.guardians)) as GuardiansInfo[]
          for (const e of deleteChecked.value) {
            const i = guardians.findIndex((item) => item.recoveryEmail === e)
            if (i !== -1) {
              clearInterval(guardians[i].n)
              guardians.splice(i, 1)
            }
          }
        } else {
          guardians = form.guardians
        }
        const guardianData = guardians.map((e) => {
          return {
            email: e.recoveryEmail,
            isSelfGuardian: e.isSelfGuardian,
            emailHash: e.emailHash,
            pepper: e.pepper,
          }
        })
        const hash = await updateGuardian(auth.password, guardianData)
        if (hash) {
          checkHash(hash)
        } else {
          auth.loading = false
        }
      }
    })
  }

  const updateGuardian = async (password: string, guardianData: GuardianData[]) => {
    const user = userStore.user
    const sessionKeyPrivateKey = await decryptSessionKey(
      user.sessionKey.aesKey,
      user.sessionKey.localKey.keystore,
    )

    const timestamp = user.sessionKey.expires
    const sessionKeyAddress = user.sessionKey.localKey.address
    const permit = user.sessionKey.authorization
    const weight = Number(process.env.VUE_APP_Permit_Weight)
    const timestampNow = dayjs().add(10, 'minute').unix()

    const res = await api.queryAccountKeystore({
      email: user.email,
      kdfPassword: generateKdfPassword(password),
      // todo captchaToken
      captchaToken: '',
      sessionKeyPermit: {
        timestamp,
        timestampNow,
        permit,
        sessionKeyAddress,
        sig: await signMsg(SIG_PREFIX.LOGIN + timestampNow, sessionKeyPrivateKey, false),
        weight,
      },
    })
    if (!res.ok) {
      return ''
    }
    const keystore = res.data.keystore

    const sessionKeyPermit = {
      timestamp: timestamp,
      timestampNow: timestamp,
      permit,
      sessionKeyAddress,
      sig: await signMsg(SIG_PREFIX.UPDATE_GUARDIAN + timestamp, sessionKeyPrivateKey, false),
      weight,
    }

    const oldKeyset = Keyset.fromJson(user.keyset.keysetJson)
    const regesterEmailKey = oldKeyset.keys[1] as KeyEmailDkim
    const policyKey = oldKeyset.keys[oldKeyset.keys.length - 1] as KeySecp256k1

    const keyset = getAccountKeysetJson(
      guardianData,
      user.email,
      user.keyset.masterKeyAddress,
      policyKey.address,
      regesterEmailKey.pepper,
    )

    form.keysetJson = keyset.toJson()
    form.hash = keyset.hash()

    const checkKeysetRes = await api.checkKeyset({
      email: user.email,
      sessionKeyPermit,
      keysetJson: keyset.toJson(),
      isAddGuradian: auth.type === 'add',
    })
    if (!checkKeysetRes.ok) {
      return ''
    }
    const upAuthToken = checkKeysetRes.data.upAuthToken

    const metaNonce = await blockchain.getMetaNonce(user.account)
    const txBuilder = new UpdateKeysetHashTxBuilder(user.account, metaNonce, keyset.hash(), false)
    const digestHash = txBuilder.digestMessage()

    const action = 'updateKeyset'
    const masterKeySig = await Tss.generateTssTxSignature(
      user.email,
      upAuthToken,
      action,
      keystore,
      user.keyset.masterKeyAddress,
      password,
      digestHash,
    )
    const updateGuardianKeysetRes = await api.updateGuardian({
      email: user.email,
      sessionKeyPermit,
      upAuthToken,
      masterKeySig,
    })
    if (!updateGuardianKeysetRes.ok) {
      return ''
    }
    const hash = updateGuardianKeysetRes.data.transactionHash
    return hash
  }

  const deleteChecked = ref([] as string[])

  const submit = (authType: AuthType) => {
    if (form.guardians.every((e) => e.type === 'success')) {
      auth.show = true
      auth.type = authType
      clearInterval(polling)
      polling = undefined
      for (const guardia of form.guardians) {
        clearInterval(guardia.n)
      }
    } else {
      unipass.error($t('HaveWaitingGuardian'))
    }
  }

  const back = () => {
    if (submitDisabled.value) {
      router.back()
    } else {
      ElMessageBox.confirm($t('ActionNotCommitted'), $t('Notification'), {
        confirmButtonText: $t('Confirm'),
        cancelButtonText: $t('Cancel'),
        center: true,
        showClose: false,
      })
        .then(() => {
          router.back()
        })
        .catch(() => {})
    }
  }

  const closeGuardian = (i: number) => {
    clearInterval(form.guardians[i].n)
    form.guardians.splice(i, 1)
  }

  const init = () => {
    const keysetJson = userStore.user?.keyset.keysetJson
    if (keysetJson) {
      const keyset = JSON.parse(keysetJson)
      const list = keyset.slice(2, -1)
      for (const e of list) {
        form.guardians.push({
          recoveryEmail: e.KeyEmailDkim.emailFrom,
          type: 'success',
          added: true,
          n: 0,
          count: 0,
          loading: false,
          isSelfGuardian: false,
          emailHash: e.KeyEmailDkim.emailHash,
          pepper: e.KeyEmailDkim.pepper,
        })
      }
      form.guardiansBackup = form.guardians.map((e) => e.recoveryEmail).join(',')
    }
  }

  init()

  onUnmounted(() => {
    clearInterval(polling)
    polling = undefined
    for (const guardia of form.guardians) {
      clearInterval(guardia.n)
    }
  })

  return {
    back,
    sendLink,
    authentication,
    deleteChecked,
    submitDisabled,
    submit,
    formElement,
    authElement,
    unipass,
    form,
    auth,
    userStore,
    closeGuardian,
  }
}
