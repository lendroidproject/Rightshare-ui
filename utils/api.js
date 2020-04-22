import axios from 'axios'

const MAIN_NETWORK = process.env.MAIN_NETWORK
const OPENSEA_API_KEY = process.env.OPENSEA_API_KEY

export function withBaseURL(path) {
  const apiEndpoint = MAIN_NETWORK ? 'https://api.opensea.io/api/v1' : 'https://rinkeby-api.opensea.io/api/v1'
  return `${apiEndpoint}${path}`
}

axios.defaults.withCredentials = true
axios.defaults.timeout = 30 * 1000 // Max time limit: 30s
axios.defaults.method = 'GET'
axios.defaults.headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

const baseHeaders = {
  'x-api-key': OPENSEA_API_KEY,
}

function jsonConfig(config) {
  return config
}

function request(config, base = true) {
  if (config.data) {
    jsonConfig(config)
  }

  const { url, headers, ...originConfig } = config

  return axios.request({
    url: base ? withBaseURL(url) : url,
    headers: base
      ? {
          ...headers,
          ...baseHeaders,
        }
      : headers,
    ...originConfig,
  })
}

export function getMyAssets(params) {
  return request({
    url: '/assets',
    params,
  })
}

export function fetchMetadata(url) {
  return request({ url }, false)
}

export default axios
