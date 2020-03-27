import axios from 'axios'

const MAIN_NETWORK = process.env.MAIN_NETWORK === 'true'
const OPENSEA_API_KEY = process.env.OPENSEA_API_KEY

export function getBaseURL() {
  const apiEndpoint = MAIN_NETWORK ? 'https://api.opensea.io/api/v1' : 'https://rinkeby-api.opensea.io/api/v1'
  return apiEndpoint
}

// axios.defaults.withCredentials = true
axios.defaults.baseURL = getBaseURL()
axios.defaults.timeout = 30 * 1000 // Max time limit: 30s
axios.defaults.method = 'GET'
axios.defaults.headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'X-API-KEY': OPENSEA_API_KEY,
  'Access-Control-Allow-Origin': '*',
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
  delete params.limit
  return request({
    url: '/assets',
    params: {
      format: 'json',
      ...params,
    },
  })
}

export default axios
