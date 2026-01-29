const db = require('../config/db')

const createPollutant = (data) => {
    const p = data.current.pollution;
    return {
        pollutant_main: p.mainus,
        aqi: p.aqius,
        recorded_at: p.ts,
        details: {
            p2: p.p2 ? p.p2.conc : 0, 
            p1: p.p1 ? p.p1.conc : 0, 
            n2: p.n2 ? p.n2.conc : 0,
            s2: p.s2 ? p.s2.conc : 0,
            co: p.co ? p.co.conc : 0
        }
    }
}

const addPollutantData = async (locationId, data) => {
    try {
        const sql = `
            INSERT INTO pollutants 
            (location_id, pollutant_type, aqi_value, recorded_at) 
            VALUES (?, ?, ?, NOW())
        `;

        console.log("Data yang akan di-insert ke DB:", { locationId, ...data });

        const [result] = await db.execute(sql, [
            locationId,
            data.main_pollutant, 
            data.aqi             
        ]);
        return result;
    } catch (err) {
        console.error("DATABASE ERROR (pollutants):", err.sqlMessage || err.message);
        throw err; 
    }
}

const getLatestPollutantByCity = async (city) => {
    const sql = `
        SELECT p.*, l.city_name 
        FROM pollutants p
        JOIN locations l ON p.location_id = l.id
        WHERE l.city_name = ?
        ORDER BY p.recorded_at DESC
        LIMIT 1
    `
    const [rows] = await db.execute(sql, [city])
    return rows[0]
}

const deletePollutantByCity = async (city) => {
    const sql = `
        DELETE p FROM pollutants p
        JOIN locations l ON p.location_id = l.id
        WHERE l.city_name = ?
    `;
    const [result] = await db.execute(sql, [city]);
    return result;
};


module.exports = {createPollutant,addPollutantData,getLatestPollutantByCity,deletePollutantByCity}
