// const jwt = require('jsonwebtoken')

// const authMiddleware = (req, res, next) => {
//     const authHeader = req.headers.authorization

//     if (!authHeader) {
//         return res.status(401).json({ msg: 'Token required' })
//     }

//     try {
//         const token = authHeader.split(' ')[1]
//         const decoded = jwt.verify(token, process.env.JWT_SECRET)
//         req.user = decoded
//         next()
//     } catch (error) {
//         return res.status(401).json({ msg: 'Invalid token' })
//     }
// }

// module.exports = authMiddleware
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


module.exports = { findOrCreateLocation, saveAirQuality, getAirQualityHistory, deleteAirQuality };
