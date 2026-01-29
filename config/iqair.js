require('dotenv').config()
const axios = require('axios')

const iqair = axios.create({
    baseURL : 'https://api.airvisual.com/v2',
    params : {
        key : process.env.IQAIR_API_KEY
    }
})

module.exports = iqair
