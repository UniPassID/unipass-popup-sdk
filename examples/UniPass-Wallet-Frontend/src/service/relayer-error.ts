import { AxiosResponse } from 'axios'

export const initRelayerError = (statusCode: number) => {
  console.error('relayer error code: ' + statusCode)
}
export const initRelayerResponse = (response: AxiosResponse) => {
  console.log(response)

  if (!response.data?.statusCode) {
    response.data = { ok: false, statusCode: 404 }
  }
  // init error
  if (response.data.statusCode === 200) {
    response.data.ok = true
  } else {
    response.data.ok = false
    initRelayerError(response.data.statusCode)
  }

  return response.data
}
