import axios from 'axios'

const OPENSEA_API_URL = process.env.OPENSEA_API_URL
const OPENSEA_API_KEY = process.env.OPENSEA_API_KEY

export function getBaseURL() {
  const apiEndpoint = OPENSEA_API_URL
  return apiEndpoint
}

axios.defaults.withCredentials = true
axios.defaults.baseURL = getBaseURL()
axios.defaults.timeout = 30 * 1000 // Max time limit: 30s
axios.defaults.method = 'GET'
axios.defaults.headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'X-API-KEY': OPENSEA_API_KEY,
}

function jsonConfig(config) {
  return config
}

function request(config) {
  if (config.data) {
    jsonConfig(config)
  }

  return axios.request(config)
}

export function getMyAssets(params) {
  return request({
    url: '/assets',
    params: {
      format: 'json',
      ...params,
    },
  })
}

export default axios
