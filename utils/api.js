import axios from 'axios'

const { OPENSEA_API_URL } = process.env

export function getBaseURL() {
  const apiEndpoint = OPENSEA_API_URL
  return apiEndpoint
}

axios.defaults.withCredentials = true
axios.defaults.baseURL = getBaseURL()
axios.defaults.timeout = 30 * 1000 // Max time limit: 30s
axios.defaults.method = 'GET'

function jsonConfig(config) {
  config.headers = {
    ...config.headers,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }
  return config
}

function request(config) {
  if (config.data) {
    jsonConfig(config)
  }

  return axios.request(config)
}

export function getMyAssets(address) {
  return request({ url: '/assets/?format=json' })
}

export default axios
