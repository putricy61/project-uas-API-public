require('dotenv').config()
const axios = require('axios')

const iqair = axios.create({
    baseURL : 'https://api.airvisual.com/v2',
    params : {
        key : process.env.IQAIR_API_KEY
    }
})

module.exports = iqair


newsapi

require('dotenv').config()
const axios = require('axios')

const newsapi = axios.create({
    baseURL: 'https://newsapi.org/v2',
    params: {
        apiKey: process.env.NEWS_API_KEY // Pastikan di .env namanya NEWS_API_KEY
    }
})

module.exports = newsapi
