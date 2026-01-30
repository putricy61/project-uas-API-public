// const db = require('../config/db');
// const airQualityModel = require('../models/air-quality-model');
// const iqair = require('../config/iqair');
// const locationModel = require('../models/location-model');

// const axios = require('axios');


// const getAirQuality = async (req, res) => {
//     const { city, state, country } = req.query;

//     if (!city || !state || !country) {
//         return res.status(400).json({ msg: 'City, State, and Country are required!' });
//     }

//     try {
//         const response = await iqair.get('/city', {
//             params: { city, state, country }
//         });

//         const result = airQualityModel.createAirQuality(response.data.data);
       

//         return res.status(200).json(result);
//     } catch (error) {
//         console.error('IQAir Error:', error.response?.data || error.message);
//         return res.status(500).json({ msg: 'Gagal mengambil data dari IQAir' });
//     }
// };

// const saveAirQuality = async (req, res) => {
//     const { city, state, country, aqi, main_pollutant, temperature, humidity } = req.body;

//     try {
//         let location = await locationModel.getLocationByCity(city);

//         if (!location) {
//             console.log(`Kota ${city} belum ada, mendaftarkan ke tabel locations...`);
            
//             const newLoc = {
//                 city,
//                 state: state || '',
//                 country,
//                 latitude: 0, 
//                 longitude: 0
//             };
            
//             await locationModel.addLocation(req.user.id, newLoc);

//             location = await locationModel.getLocationByCity(city);
//         }

//         await airQualityModel.addAirQuality(location.id, {
//             aqi,
//             main_pollutant,
//             temperature,
//             humidity
//         });

//         return res.status(201).json({ msg: 'Berhasil simpan ke database!' });
//     } catch (error) {
//         console.error('Detail Error DB:', error.message);
//         return res.status(500).json({ msg: 'Gagal simpan ke database', detail: error.message });
//     }
// };

// const getAirQualityByLocation = async (req, res) => {
//     try {
//         const { city, country } = req.query;

//         let sql = `
//             SELECT 
//                 a.id,
//                 l.city_name,
//                 l.country,
//                 a.aqi_value,
//                 a.main_pollutant,
//                 a.temperature,
//                 a.humidity
//             FROM air_quality a
//             JOIN locations l ON a.location_id = l.id
//             WHERE 1=1
//         `;

//         const params = [];

//         if (city) {
//             sql += ' AND l.city_name LIKE ?';
//             params.push(`%${city}%`);
//         }

//         if (country) {
//             sql += ' AND l.country LIKE ?';
//             params.push(`%${country}%`);
//         }

//         sql += ' ORDER BY a.recorded_at DESC';

//         const [rows] = await db.execute(sql, params);
//         res.json(rows);

//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ msg: 'Gagal ambil data' });
//     }
// };

// const deleteAirQuality = async (req, res) => {
//     try {
//         const { id } = req.params;

//         const [result] = await db.execute(
//             'DELETE FROM air_quality WHERE id = ?',
//             [id]
//         );

//         if (result.affectedRows === 0) {
//             return res.status(404).json({ msg: 'Data tidak ditemukan' });
//         }

//         res.json({ msg: 'Deleted' });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ msg: 'Gagal hapus' });
//     }
// };

// module.exports = {
//     getAirQuality,
//     saveAirQuality,
//     getAirQualityByLocation,
//     deleteAirQuality
// };

// const db = require('../config/db');
// const airQualityModel = require('../models/air-quality-model');
// const iqair = require('../config/iqair');
// const locationModel = require('../models/location-model');

// const axios = require('axios');


// const getAirQuality = async (req, res) => {
//     const { city, state, country } = req.query;

//     if (!city || !state || !country) {
//         return res.status(400).json({ msg: 'City, State, and Country are required!' });
//     }

//     try {
//         const response = await iqair.get('/city', {
//             params: { city, state, country }
//         });

//         const result = airQualityModel.createAirQuality(response.data.data);
       

//         return res.status(200).json(result);
//     } catch (error) {
//         console.error('IQAir Error:', error.response?.data || error.message);
//         return res.status(500).json({ msg: 'Gagal mengambil data dari IQAir' });
//     }
// };

// const saveAirQuality = async (req, res) => {
//     const { city, state, country, aqi, main_pollutant, temperature, humidity } = req.body;

//     try {
//         let location = await locationModel.getLocationByCity(city);

//         if (!location) {
//             console.log(`Kota ${city} belum ada, mendaftarkan ke tabel locations...`);
            
//             const newLoc = {
//                 city,
//                 state: state || '',
//                 country,
//                 latitude: 0, 
//                 longitude: 0
//             };
            
//             await locationModel.addLocation(req.user.id, newLoc);

//             location = await locationModel.getLocationByCity(city);
//         }

//         await airQualityModel.addAirQuality(location.id, {
//             aqi,
//             main_pollutant,
//             temperature,
//             humidity
//         });

//         return res.status(201).json({ msg: 'Berhasil simpan ke database!' });
//     } catch (error) {
//         console.error('Detail Error DB:', error.message);
//         return res.status(500).json({ msg: 'Gagal simpan ke database', detail: error.message });
//     }
// };

// const getAirQualityByLocation = async (req, res) => {
//     try {
//         const { city, country } = req.query;

//         let sql = `
//             SELECT 
//                 a.id,
//                 l.city_name,
//                 l.country,
//                 a.aqi_value,
//                 a.main_pollutant,
//                 a.temperature,
//                 a.humidity
//             FROM air_quality a
//             JOIN locations l ON a.location_id = l.id
//             WHERE 1=1
//         `;

//         const params = [];

//         if (city) {
//             sql += ' AND l.city_name LIKE ?';
//             params.push(`%${city}%`);
//         }

//         if (country) {
//             sql += ' AND l.country LIKE ?';
//             params.push(`%${country}%`);
//         }

//         sql += ' ORDER BY a.recorded_at DESC';

//         const [rows] = await db.execute(sql, params);
//         res.json(rows);

//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ msg: 'Gagal ambil data' });
//     }
// };

// const deleteAirQuality = async (req, res) => {
//     try {
//         const { id } = req.params;

//         const [result] = await db.execute(
//             'DELETE FROM air_quality WHERE id = ?',
//             [id]
//         );

//         if (result.affectedRows === 0) {
//             return res.status(404).json({ msg: 'Data tidak ditemukan' });
//         }

//         res.json({ msg: 'Deleted' });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ msg: 'Gagal hapus' });
//     }
// };

// module.exports = {
//     getAirQuality,
//     saveAirQuality,
//     getAirQualityByLocation,
//     deleteAirQuality
// };

const AirQualityModel = require('../models/air-quality-model');
const WeatherModel = require('../models/weather-model');

// 1. Fungsi Search (Menampilkan data dari API IQAir)
const searchAndShow = async (req, res) => {
    const { city } = req.query;
    const state = "West Java";
    const country = "Indonesia";
    
    try {
        const response = await fetch(`https://api.airvisual.com/v2/city?city=${city}&state=${state}&country=${country}&key=${process.env.IQAIR_API_KEY}`);
        const result = await response.json();

        if (result.status === "success") {
            return res.status(200).json({ 
                success: true, 
                data: {
                    city: result.data.city,
                    aqi: result.data.current.pollution.aqius,
                    main_p: result.data.current.pollution.mainus,
                    temp: result.data.current.weather.tp,
                    hum: result.data.current.weather.hu,
                    ws: result.data.current.weather.ws,
                    lat: result.data.location.coordinates[1],
                    lon: result.data.location.coordinates[0]
                } 
            });
        }
        res.status(404).json({ success: false, message: "Kota tidak ditemukan" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 2. Fungsi Simpan (Menyimpan data ke Database)
const saveToFavorite = async (req, res) => {
    const { city } = req.body; // Cuma butuh city dari user
    const userId = req.user.id;
    const state = "West Java";
    const country = "Indonesia";

    try {
        // 1. Backend cari dulu data lengkapnya ke API IQAir
        const response = await fetch(
            `https://api.airvisual.com/v2/city?city=${city}&state=${state}&country=${country}&key=${process.env.IQAIR_API_KEY}`
        );
        const result = await response.json();

        if (result.status !== "success") {
            return res.status(404).json({ success: false, message: "Data kota tidak ditemukan di API" });
        }

        const apiData = result.data;

        // 2. Simpan ke tabel air_quality pake data dari API
        await AirQualityModel.saveAirQuality({
            user_id: userId,
            city: apiData.city,
            aqi: apiData.current.pollution.aqius,
            main_pollutant: apiData.current.pollution.mainus,
            lat: apiData.location.coordinates[1],
            lon: apiData.location.coordinates[0]
        });

        // 3. Simpan ke tabel weather pake data dari API
        await WeatherModel.saveWeather({
            user_id: userId,
            city: apiData.city,
            temp: apiData.current.weather.tp,
            humidity: apiData.current.weather.hu,
            wind_speed: apiData.current.weather.ws
        });

        res.status(201).json({ 
            success: true, 
            message: `Berhasil! Data ${apiData.city} disimpan ke Favorit.` 
        });

    } catch (error) {
        console.error("ERROR AUTO SAVE:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};
// 3. Fungsi Ambil Riwayat
const getHistory = async (req, res) => {
    try {
        const rows = await AirQualityModel.getAirQualityHistory(req.user.id);
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 4. Fungsi Hapus
const remove = async (req, res) => {
    try {
        await AirQualityModel.deleteAirQuality(req.params.id, req.user.id);
        res.status(200).json({ success: true, message: "Riwayat polusi dihapus" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// PASTIKAN NAMA DI SINI SAMA DENGAN NAMA FUNGSI DI ATAS
module.exports = { 
    searchAndShow, 
    saveToFavorite, 
    getHistory, 
    remove 
};
