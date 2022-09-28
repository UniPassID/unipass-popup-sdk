import { AxiosResponse } from 'axios'
import i18n from '@/plugins/i18n'
import { upError } from '@/utils/useUniPass'

const { t: $t } = i18n.global
// https://www.notion.so/lay2/589cad6cd73e4fcf8b2e37fec22efbd1
const showCode = {
  200: false,
  // email code
  1000: 'RequestsTooFrequent', // $t('RequestsTooFrequent'),
  1001: 'IncorrectCcode', // $t('IncorrectCcode'),
  1002: 'IncorrectCcode', // $t('IncorrectCcode'),
  1006: 'RequestsTooFrequent', // $t('RequestsTooFrequent'),
  1008: false,
  1009: 'IncorrectCcode', // $t('IncorrectCcode'),
  // captcha code
  2000: '', // todo code 图形验证码错误
  // accout
  3000: false,
  3001: 'IncorrectAccountOrPassword', // $t('IncorrectAccountOrPassword'),
  3003: '', // todo code cloud key 密码验证错误次数过多，验证时间冻结
  3005: false,
  3006: false,
  3007: 'SystemBusy', // $t('SystemBusy'),
  3008: '', // todo code captchaToken 缺失
  5000: false,
  5001: false,
  5002: false,
  5004: false,
  5005: 'AccountPending', // $t('AccountPending'),
  5006: false,
  5007: false,
  5008: false,
  5009: false,
  5010: false,
  5011: false,
  5012: 'SamePasswordToLogin', //$t('SamePasswordToLogin'),
  5014: false,
  5015: false,
  // params
  422: false,
}

export const initError = (statusCode: number) => {
  if (showCode[statusCode]) {
    upError($t(showCode[statusCode]))
  } else {
    console.error('error code: ' + statusCode)
  }
}
export const initResponse = (response: AxiosResponse) => {
  if (!response.data?.statusCode) {
    response.data = { ok: false, statusCode: 404 }
  }
  // init error
  if (response.data.statusCode === 200) {
    response.data.ok = true
  } else {
    response.data.ok = false
    initError(response.data.statusCode)
  }
  return response.data
}
