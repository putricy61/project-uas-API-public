const db = require('../config/db');


const saveWeather = async (data) => {
    console.log("LOG: SIMPAN WEATHER LANGSUNG KE TABEL");
    const sql = `INSERT INTO weather (user_id, city, temp, humidity, wind_speed) VALUES (?, ?, ?, ?, ?)`;
    return await db.execute(sql, [
        data.user_id || null,
        data.city || null,
        data.temp || null,
        data.humidity || null,
        data.wind_speed || null
    ]);
};

const getWeatherHistory = async (userId) => {
    const sql = `SELECT * FROM weather WHERE user_id = ? ORDER BY created_at DESC`;
    const [rows] = await db.execute(sql, [userId]);
    return rows;
};


const deleteWeather = async (id, userId) => {
    const sql = `DELETE FROM weather WHERE id = ? AND user_id = ?`;
    return await db.execute(sql, [id, userId]);
};

const getWeatherAvg = async (userId) => {
    // AVG adalah fungsi SQL untuk menghitung rata-rata
    const sql = `SELECT 
                    AVG(temp) as average_temperature, 
                    AVG(humidity) as average_humidity 
                 FROM weather 
                 WHERE user_id = ?`;
    const [rows] = await db.execute(sql, [userId]);
    return rows[0];
};

module.exports = { saveWeather, getWeatherHistory, deleteWeather, getWeatherAvg };// const db = require('../config/db')

// const createWeather = (data)=>{
//     return{
//         temperature : data.current.weather.tp,
//         humidity : data.current.weather.hu,
//         wind_speed : data.current.weather.ws,
//         wind_direction : data.current.weather.wd,
//         weather_icon : data.current.weather.ic
//     }
// }

// const addWeatherData = async (locationId, data) => {
//     const sql = `
//         INSERT INTO weather 
//         (location_id, temperature, pressure, humidity, wind_speed, wind_direction, weather_icon, recorded_at) 
//         VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
//     `
//     return db.execute(sql, [
//         locationId,
//         data.tp, 
//         data.pr, 
//         data.hu, 
//         data.ws, 
//         data.wd, 
//         data.ic  
//     ])
// }

// const getAllWeatherHistory = async () => {

//     const sql = `
//         SELECT w.*, l.city_name 
//         FROM weather w 
//         JOIN locations l ON w.location_id = l.id
//         ORDER BY w.recorded_at DESC
//     `;
//     const [rows] = await db.execute(sql);
//     return rows; 
// };

// const getLatestWeatherByCity = async (city) => {

//     const sql = `
//         SELECT w.*, l.city_name 
//         FROM weather w 
//         JOIN locations l ON w.location_id = l.id 
//         WHERE l.city_name = ?
//         ORDER BY w.recorded_at DESC
//         LIMIT 10
//     `;
//     const [rows] = await db.execute(sql, [city]);
//     return rows;
// }

// const getWeatherHistoryByCity = async (city) => {
//     const sql = `
//         SELECT w.*, l.city_name 
//         FROM weather w
//         JOIN locations l ON w.location_id = l.id
//         WHERE l.city_name = ?
//         ORDER BY w.recorded_at DESC
//     `
//     const [rows] = await db.execute(sql, [city])
//     return rows
// }

// const deleteWeatherByCity = async (city) => {
//     const sql = `
//         DELETE w FROM weather w
//         JOIN locations l ON w.location_id = l.id
//         WHERE l.city_name = ?
//     `;
//     const [result] = await db.execute(sql, [city]);
//     return result;
// };

// module.exports = {createWeather,addWeatherData, getAllWeatherHistory,
//     getLatestWeatherByCity, 
//     getWeatherHistoryByCity, deleteWeatherByCity}
