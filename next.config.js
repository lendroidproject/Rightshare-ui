require('dotenv').config()
const withImages = require('next-images')

module.exports = withImages({
  env: {
    // Reference a variable that was defined in the .env file and make it available at Build Time
    OPENSEA_API_URL: process.env.OPENSEA_API_URL,
    OPENSEA_API_KEY: process.env.OPENSEA_API_KEY,
  },
})
