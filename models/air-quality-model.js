const db = require('../config/db')

const createAirQuality = (data) => {
    return {
        city: data.city,
        state: data.state,
        country: data.country,
        aqi: data.current.pollution.aqius,
        main_pollutant: data.current.pollution.mainus,
        temperature: data.current.weather.tp,
        humidity: data.current.weather.hu,
        icon: data.current.weather.ic 
    };
};

const addAirQuality = async (location_id, data) => {

    const query = `
        INSERT INTO air_quality 
        (location_id, aqi_value, main_pollutant, temperature, humidity) 
        VALUES (?, ?, ?, ?, ?)
    `;
    
    return db.execute(query, [
        location_id,
        data.aqi,
        data.main_pollutant,
        data.temperature,
        data.humidity
    ]);
};

const getAirQualityByCity = async (city) => {
    const sql = `
        SELECT aq.*
        FROM air_quality aq
        JOIN locations l ON aq.location_id = l.id
        WHERE l.city_name = ?
        ORDER BY aq.recorded_at DESC
    `
    const [rows] = await db.execute(sql, [city])
    return rows
}

const deleteAirQualityByCity = async (city) => {
    const sql = `DELETE FROM air_quality WHERE city_name = ?`;
    const [result] = await db.execute(sql, [city]);
    return result; 
};


module.exports = {createAirQuality,addAirQuality,getAirQualityByCity,deleteAirQualityByCity}
