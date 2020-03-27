require('dotenv').config()
const withOffline = require('next-offline')
const withImages = require('next-images')

module.exports = withOffline(
  withImages({
    env: {
      // Reference a variable that was defined in the .env file and make it available at Build Time
      MAIN_NETWORK: process.env.MAIN_NETWORK,
      OPENSEA_API_KEY: process.env.OPENSEA_API_KEY,
    },
  })
)
