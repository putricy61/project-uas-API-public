const db = require('../config/db');

const findOrCreateLocation = async (data) => {
    console.log("LOG: MENCARI/MEMBUAT LOKASI:", data.city);
    const findSql = `SELECT id FROM locations WHERE city = ? AND state = ?`;
    const [rows] = await db.execute(findSql, [data.city, data.state]);
    
    if (rows.length > 0) return rows[0].id;

    const insertSql = `INSERT INTO locations (city, state, country, lat, lon) VALUES (?, ?, ?, ?, ?)`;
    const [result] = await db.execute(insertSql, [
        data.city || null,
        data.state || null,
        data.country || null,
        data.lat || null,
        data.lon || null
    ]);
    return result.insertId;
};

const saveAirQuality = async (data) => {
    console.log("LOG: SIMPAN AIR QUALITY KE TABEL");
    // Tambahkan kolom lat dan lon di sini
    const sql = `INSERT INTO air_quality (user_id, city, aqi, main_pollutant, lat, lon) VALUES (?, ?, ?, ?, ?, ?)`;
    
    return await db.execute(sql, [
        data.user_id || null,
        data.city || null,
        data.aqi || null,
        data.main_pollutant || 'n/a',
        data.lat || null, // Tambahkan ini
        data.lon || null  // Tambahkan ini
    ]);
};

const getAirQualityHistory = async (userId) => {
    const sql = `SELECT * FROM air_quality WHERE user_id = ? ORDER BY created_at DESC`;
    const [rows] = await db.execute(sql, [userId]);
    return rows;
};

const deleteAirQuality = async (id, userId) => {
    const sql = `DELETE FROM air_quality WHERE id = ? AND user_id = ?`;
    return await db.execute(sql, [id, userId]);
};


module.exports = { findOrCreateLocation, saveAirQuality, getAirQualityHistory, deleteAirQuality };// const db = require('../config/db')

// const createAirQuality = (data) => {
//     return {
//         city: data.city,
//         state: data.state,
//         country: data.country,
//         aqi: data.current.pollution.aqius,
//         main_pollutant: data.current.pollution.mainus,
//         temperature: data.current.weather.tp,
//         humidity: data.current.weather.hu,
//         icon: data.current.weather.ic 
//     };
// };

// const addAirQuality = async (location_id, data) => {

//     const query = `
//         INSERT INTO air_quality 
//         (location_id, aqi_value, main_pollutant, temperature, humidity) 
//         VALUES (?, ?, ?, ?, ?)
//     `;
    
//     return db.execute(query, [
//         location_id,
//         data.aqi,
//         data.main_pollutant,
//         data.temperature,
//         data.humidity
//     ]);
// };

// const getAirQualityByCity = async (city) => {
//     const sql = `
//         SELECT aq.*
//         FROM air_quality aq
//         JOIN locations l ON aq.location_id = l.id
//         WHERE l.city_name = ?
//         ORDER BY aq.recorded_at DESC
//     `
//     const [rows] = await db.execute(sql, [city])
//     return rows
// }

// const deleteAirQualityByCity = async (city) => {
//     const sql = `DELETE FROM air_quality WHERE city_name = ?`;
//     const [result] = await db.execute(sql, [city]);
//     return result; 
// };


// module.exports = {createAirQuality,addAirQuality,getAirQualityByCity,deleteAirQualityByCity}
