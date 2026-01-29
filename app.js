require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

const airQualityRoute = require('./routes/air-quality-route')
const pollutantRoute = require('./routes/pollutant-route')
const weatherRoute = require('./routes/weather-route')
const locationRoute = require('./routes/location-route')
const authRoute = require('./routes/auth-route')

app.use('/api/auth', authRoute)
app.use('/api/location', locationRoute)
app.use('/api/weather', weatherRoute)
app.use('/api/pollutant', pollutantRoute)
app.use('/api/air-quality', airQualityRoute) 

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})