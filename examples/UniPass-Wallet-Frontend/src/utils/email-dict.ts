// https://www.notion.so/lay2/PRD-cc96c53c254d4d1f80ebb64354781561

const google = ['gmail.com', 'googlemail.com']
const yahoo = ['yahoo.com']
const tencent = ['qq.com', 'foxmail.com']
const apple = ['icloud.com']
const protonmail = ['protonmail.com', 'proton.me', 'pm.me']
const microsoft = ['outlook.com', 'hotmail.com']
const mail = ['mail.com']
const netease = [
  '163.com',
  '126.com',
  'yeah.net',
  'vip.163.com',
  'vip.126.com',
  '188.com',
  'vip.188.com',
]

export const emailLowercaseFormat = [...google, ...yahoo, ...tencent, ...netease, ...apple]
export const emailLowercasePrompt = [...protonmail, ...microsoft, ...mail]
export const emailDotPrompt = [...protonmail, ...google]
export const emailDotNoPrompt = [...yahoo, ...tencent, ...netease, ...apple, ...microsoft, ...mail]

export default {
  google,
  yahoo,
  tencent,
  apple,
  protonmail,
  microsoft,
  mail,
  netease,
}
