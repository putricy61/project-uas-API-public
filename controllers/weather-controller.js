// const cache = require('../config/node-cache');
// const iqair = require('../config/iqair');
// const weatherModel = require('../models/weather-model');
// const locationModel = require('../models/location-model');


// const getWeatherByCity = async (req, res) => {
//     const { city, state, country } = req.query;
//     if (!city) return res.status(400).json({ msg: 'City is required' });

//     try {
//     let response = await iqair.get('/city', {
//         params: { 
//             city, 
//             state: state || city, 
//             country: country || 'Indonesia',
//             key: process.env.IQAIR_API_KEY 
//         }
//     });

//     if (!response.data || response.data.status === 'fail') {
//         response = await iqair.get('/nearest_city', {
//             params: { key: process.env.IQAIR_API_KEY } // Nyari yang terdekat dari IP Server
//         });
//     }

//     const data = response.data.data;
    
//     const result = {
//         city: data.city,
//         temperature: data.current.weather.tp,
//         humidity: data.current.weather.hu,
//         pressure: data.current.weather.pr,
//         wind_speed: data.current.weather.ws,
//         weather_icon: data.current.weather.ic,
//         latitude: data.location.coordinates[1],
//         longitude: data.location.coordinates[0]
//     };

//     return res.status(200).json(result);

// } catch (error) {

//     const errorMsg = error.response?.data?.data?.message === 'city_not_found' 
//         ? "Kota tidak ditemukan. Gunakan nama bahasa Inggris (misal: West Java)" 
//         : "Gagal ambil data cuaca";
        
//     console.error("IQAir Error:", error.response?.data || error.message);
//     return res.status(500).json({ msg: errorMsg });
// }
// };
// const syncWeather = async (req, res) => {
//     const { city } = req.body

//     try {
//         const location = await locationModel.getLocationByCity(city)
//         if (!location) {
//             return res.status(404).json({ msg: 'Location not found in database' })
//         }

//         const response = await iqair.get('/nearest_city', {
//             params: { lat: location.latitude, lon: location.longitude }
//         })

//         const weatherData = response.data.data.current.weather
//         await weatherModel.addWeatherData(location.id, weatherData)

//         return res.status(201).json({
//             msg: `Weather data for ${city} synced and saved`,
//             data: weatherData
//         })
//     } catch (error) {
//         return res.status(500).json({
//             msg: 'Failed to sync weather data',
//             error: error.message
//         })
//     }
// }

// const getAllWeather = async (req, res) => {
//     try {
//         const data = await weatherModel.getAllWeatherHistory();
//         return res.status(200).json({ data: data });
//     } catch (error) {
//         return res.status(500).json({ msg: error.message });
//     }
// };

// const getLatestWeather = async (req, res) => {
//     try {

//         const { city } = req.params; 

//         const data = await WeatherModel.getLatestWeatherByCity(city);

//         if (!data || data.length === 0) {
//             return res.status(404).json({ 
//                 msg: `Data untuk kota ${city} tidak ditemukan di database.` 
//             });
//         }
//         console.log("CITY INPUT:", city);


//         res.status(200).json({ data });
//     } catch (error) {
//         console.error("Error di Controller:", error);
//         res.status(500).json({ msg: "Gagal mengambil data cuaca terbaru" });
//     }
// };

// const getWeatherHistory = async (req, res) => {
//     const { city } = req.params
//     const data = await weatherModel.getWeatherHistoryByCity(city)
//     return res.status(200).json(data)
// }

// const removeWeatherByCity = async (req, res) => {
//     const { city } = req.params;

//     try {

//         const result = await weatherModel.deleteWeatherByCity(city);

//         if (result.affectedRows === 0) {
//             return res.status(404).json({ 
//                 msg: `No weather data found for ${city}. Nothing to delete.` 
//             });
//         }

//         return res.status(200).json({ 
//             msg: `All weather history for ${city} has been cleared` 
//         });
//     } catch (error) {
//         return res.status(500).json({ msg: 'Delete failed', error: error.message });
//     }
// }

// module.exports = { 
//     getWeatherByCity, 
//     syncWeather, 
//     getAllWeather, 
//     getLatestWeather, 
//     getWeatherHistory, 
//     removeWeatherByCity 
// };

const WeatherModel = require('../models/weather-model');

// 1. GET: Cari data cuaca dari API IQAir
const searchAndShow = async (req, res) => {
    const { city } = req.query;
    const state = "West Java";
    const country = "Indonesia";

    try {
        const response = await fetch(
            `https://api.airvisual.com/v2/city?city=${city}&state=${state}&country=${country}&key=${process.env.IQAIR_API_KEY}`
        );
        const result = await response.json();

        if (result.status === "success") {
            return res.status(200).json({
                success: true,
                data: {
                    city: result.data.city,
                    temp: result.data.current.weather.tp,
                    hum: result.data.current.weather.hu,
                    ws: result.data.current.weather.ws
                }
            });
        }
        res.status(404).json({ success: false, message: "Kota tidak ditemukan" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 2. POST: Simpan ke Favorit (Bisa manual atau auto-fetch seperti AQ)
const saveToFavorite = async (req, res) => {
    const { city } = req.body;
    const userId = req.user.id;
    const state = "West Java";
    const country = "Indonesia";

    try {
        // Ambil data terbaru dulu dari API biar lengkap pas disimpan
        const response = await fetch(
            `https://api.airvisual.com/v2/city?city=${city}&state=${state}&country=${country}&key=${process.env.IQAIR_API_KEY}`
        );
        const result = await response.json();

        if (result.status !== "success") {
            return res.status(404).json({ success: false, message: "Gagal ambil data cuaca untuk disimpan" });
        }

        const apiData = result.data;

        await WeatherModel.saveWeather({
            user_id: userId,
            city: apiData.city,
            temp: apiData.current.weather.tp,
            humidity: apiData.current.weather.hu,
            wind_speed: apiData.current.weather.ws
        });

        res.status(201).json({ success: true, message: `Cuaca ${apiData.city} disimpan ke favorit!` });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 3. GET: Tampilkan semua favorit dari DB
const getHistory = async (req, res) => {
    try {
        const rows = await WeatherModel.getWeatherHistory(req.user.id);
        res.status(200).json({ success: true, count: rows.length, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 4. DELETE: Hapus dari favorit di DB
const remove = async (req, res) => {
    try {
        await WeatherModel.deleteWeather(req.params.id, req.user.id);
        res.status(200).json({ success: true, message: "Data cuaca berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const getStats = async (req, res) => {
    const userId = req.user.id;

    try {
        const stats = await WeatherModel.getWeatherAvg(userId);
        
        // Cek jika datanya ada (biar gak null kalau user belum simpan favorit)
        if (!stats.average_temperature) {
            return res.status(200).json({ 
                success: true, 
                message: "Belum ada data untuk dihitung.",
                data: { average_temperature: 0, average_humidity: 0 } 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: "Berhasil menghitung rata-rata cuaca",
            data: {
                // Kita pakai .toFixed(2) biar angka di belakang komanya cuma 2
                average_temp: parseFloat(stats.average_temperature).toFixed(2),
                average_hum: parseFloat(stats.average_humidity).toFixed(2)
            } 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { searchAndShow, saveToFavorite, getHistory, remove, getStats };
// const cache = require('../config/node-cache');
// const iqair = require('../config/iqair');
// const weatherModel = require('../models/weather-model');
// const locationModel = require('../models/location-model');


// const getWeatherByCity = async (req, res) => {
//     const { city, state, country } = req.query;
//     if (!city) return res.status(400).json({ msg: 'City is required' });

//     try {
//     let response = await iqair.get('/city', {
//         params: { 
//             city, 
//             state: state || city, 
//             country: country || 'Indonesia',
//             key: process.env.IQAIR_API_KEY 
//         }
//     });

//     if (!response.data || response.data.status === 'fail') {
//         response = await iqair.get('/nearest_city', {
//             params: { key: process.env.IQAIR_API_KEY } // Nyari yang terdekat dari IP Server
//         });
//     }

//     const data = response.data.data;
    
//     const result = {
//         city: data.city,
//         temperature: data.current.weather.tp,
//         humidity: data.current.weather.hu,
//         pressure: data.current.weather.pr,
//         wind_speed: data.current.weather.ws,
//         weather_icon: data.current.weather.ic,
//         latitude: data.location.coordinates[1],
//         longitude: data.location.coordinates[0]
//     };

//     return res.status(200).json(result);

// } catch (error) {

//     const errorMsg = error.response?.data?.data?.message === 'city_not_found' 
//         ? "Kota tidak ditemukan. Gunakan nama bahasa Inggris (misal: West Java)" 
//         : "Gagal ambil data cuaca";
        
//     console.error("IQAir Error:", error.response?.data || error.message);
//     return res.status(500).json({ msg: errorMsg });
// }
// };
// const syncWeather = async (req, res) => {
//     const { city } = req.body

//     try {
//         const location = await locationModel.getLocationByCity(city)
//         if (!location) {
//             return res.status(404).json({ msg: 'Location not found in database' })
//         }

//         const response = await iqair.get('/nearest_city', {
//             params: { lat: location.latitude, lon: location.longitude }
//         })

//         const weatherData = response.data.data.current.weather
//         await weatherModel.addWeatherData(location.id, weatherData)

//         return res.status(201).json({
//             msg: `Weather data for ${city} synced and saved`,
//             data: weatherData
//         })
//     } catch (error) {
//         return res.status(500).json({
//             msg: 'Failed to sync weather data',
//             error: error.message
//         })
//     }
// }

// const getAllWeather = async (req, res) => {
//     try {
//         const data = await weatherModel.getAllWeatherHistory();
//         return res.status(200).json({ data: data });
//     } catch (error) {
//         return res.status(500).json({ msg: error.message });
//     }
// };

// const getLatestWeather = async (req, res) => {
//     try {

//         const { city } = req.params; 

//         const data = await WeatherModel.getLatestWeatherByCity(city);

//         if (!data || data.length === 0) {
//             return res.status(404).json({ 
//                 msg: `Data untuk kota ${city} tidak ditemukan di database.` 
//             });
//         }
//         console.log("CITY INPUT:", city);


//         res.status(200).json({ data });
//     } catch (error) {
//         console.error("Error di Controller:", error);
//         res.status(500).json({ msg: "Gagal mengambil data cuaca terbaru" });
//     }
// };

// const getWeatherHistory = async (req, res) => {
//     const { city } = req.params
//     const data = await weatherModel.getWeatherHistoryByCity(city)
//     return res.status(200).json(data)
// }

// const removeWeatherByCity = async (req, res) => {
//     const { city } = req.params;

//     try {

//         const result = await weatherModel.deleteWeatherByCity(city);

//         if (result.affectedRows === 0) {
//             return res.status(404).json({ 
//                 msg: `No weather data found for ${city}. Nothing to delete.` 
//             });
//         }

//         return res.status(200).json({ 
//             msg: `All weather history for ${city} has been cleared` 
//         });
//     } catch (error) {
//         return res.status(500).json({ msg: 'Delete failed', error: error.message });
//     }
// }

// module.exports = { 
//     getWeatherByCity, 
//     syncWeather, 
//     getAllWeather, 
//     getLatestWeather, 
//     getWeatherHistory, 
//     removeWeatherByCity 
// };
