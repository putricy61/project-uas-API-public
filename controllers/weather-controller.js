const cache = require('../config/node-cache');
const iqair = require('../config/iqair');
const weatherModel = require('../models/weather-model');
const locationModel = require('../models/location-model');


const getWeatherByCity = async (req, res) => {
    const { city, state, country } = req.query;
    if (!city) return res.status(400).json({ msg: 'City is required' });

    try {
    let response = await iqair.get('/city', {
        params: { 
            city, 
            state: state || city, 
            country: country || 'Indonesia',
            key: process.env.IQAIR_API_KEY 
        }
    });

    if (!response.data || response.data.status === 'fail') {
        response = await iqair.get('/nearest_city', {
            params: { key: process.env.IQAIR_API_KEY } // Nyari yang terdekat dari IP Server
        });
    }

    const data = response.data.data;
    
    const result = {
        city: data.city,
        temperature: data.current.weather.tp,
        humidity: data.current.weather.hu,
        pressure: data.current.weather.pr,
        wind_speed: data.current.weather.ws,
        weather_icon: data.current.weather.ic,
        latitude: data.location.coordinates[1],
        longitude: data.location.coordinates[0]
    };

    return res.status(200).json(result);

} catch (error) {

    const errorMsg = error.response?.data?.data?.message === 'city_not_found' 
        ? "Kota tidak ditemukan. Gunakan nama bahasa Inggris (misal: West Java)" 
        : "Gagal ambil data cuaca";
        
    console.error("IQAir Error:", error.response?.data || error.message);
    return res.status(500).json({ msg: errorMsg });
}
};
const syncWeather = async (req, res) => {
    const { city } = req.body

    try {
        const location = await locationModel.getLocationByCity(city)
        if (!location) {
            return res.status(404).json({ msg: 'Location not found in database' })
        }

        const response = await iqair.get('/nearest_city', {
            params: { lat: location.latitude, lon: location.longitude }
        })

        const weatherData = response.data.data.current.weather
        await weatherModel.addWeatherData(location.id, weatherData)

        return res.status(201).json({
            msg: `Weather data for ${city} synced and saved`,
            data: weatherData
        })
    } catch (error) {
        return res.status(500).json({
            msg: 'Failed to sync weather data',
            error: error.message
        })
    }
}

const getAllWeather = async (req, res) => {
    try {
        const data = await weatherModel.getAllWeatherHistory();
        return res.status(200).json({ data: data });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
};

const getLatestWeather = async (req, res) => {
    try {

        const { city } = req.params; 

        const data = await WeatherModel.getLatestWeatherByCity(city);

        if (!data || data.length === 0) {
            return res.status(404).json({ 
                msg: `Data untuk kota ${city} tidak ditemukan di database.` 
            });
        }
        console.log("CITY INPUT:", city);


        res.status(200).json({ data });
    } catch (error) {
        console.error("Error di Controller:", error);
        res.status(500).json({ msg: "Gagal mengambil data cuaca terbaru" });
    }
};

const getWeatherHistory = async (req, res) => {
    const { city } = req.params
    const data = await weatherModel.getWeatherHistoryByCity(city)
    return res.status(200).json(data)
}

const removeWeatherByCity = async (req, res) => {
    const { city } = req.params;

    try {

        const result = await weatherModel.deleteWeatherByCity(city);

        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                msg: `No weather data found for ${city}. Nothing to delete.` 
            });
        }

        return res.status(200).json({ 
            msg: `All weather history for ${city} has been cleared` 
        });
    } catch (error) {
        return res.status(500).json({ msg: 'Delete failed', error: error.message });
    }
}

module.exports = { 
    getWeatherByCity, 
    syncWeather, 
    getAllWeather, 
    getLatestWeather, 
    getWeatherHistory, 
    removeWeatherByCity 
};