import blockchain from '@/service/blockchain'
import dayjs from 'dayjs'
import dayjsDuration from 'dayjs/plugin/duration'
dayjs.extend(dayjsDuration)

export const useRecovering = () => {
  const route = useRoute()
  const address = ref('')
  const countdown = ref('　')
  const isPending = ref(true)

  const initCountdown = (date: dayjs.Dayjs) => {
    const n = setInterval(() => {
      let time = date.valueOf() - Date.now()
      if (time < 0) {
        time = 0
        clearInterval(n)
      }
      const duration = dayjs.duration(time)
      const h = date.diff(dayjs(), 'hour')
      const min = duration.get('minute')
      let s = ''
      if (h) {
        s += `${h}时 `
      }
      if (h || min) {
        s += `${min}分 `
      }
      s += `${duration.get('s')}秒`
      countdown.value = s
    }, 1000)
  }

  onBeforeMount(async () => {
    address.value = (route.query.address as string) || ''

    // init
    const res = await blockchain.getLockInfo(address.value)
    console.info(res)
    if (res.isPending) {
      initCountdown(dayjs(res.timestamp * 1000))
    } else {
      isPending.value = false
    }
  })
  return {
    isPending,
    initCountdown,
    address,
    countdown,
  }
}
