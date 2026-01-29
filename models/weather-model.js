const db = require('../config/db')

const createWeather = (data)=>{
    return{
        temperature : data.current.weather.tp,
        humidity : data.current.weather.hu,
        wind_speed : data.current.weather.ws,
        wind_direction : data.current.weather.wd,
        weather_icon : data.current.weather.ic
    }
}

const addWeatherData = async (locationId, data) => {
    const sql = `
        INSERT INTO weather 
        (location_id, temperature, pressure, humidity, wind_speed, wind_direction, weather_icon, recorded_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `
    return db.execute(sql, [
        locationId,
        data.tp, 
        data.pr, 
        data.hu, 
        data.ws, 
        data.wd, 
        data.ic  
    ])
}

const getAllWeatherHistory = async () => {

    const sql = `
        SELECT w.*, l.city_name 
        FROM weather w 
        JOIN locations l ON w.location_id = l.id
        ORDER BY w.recorded_at DESC
    `;
    const [rows] = await db.execute(sql);
    return rows; 
};

const getLatestWeatherByCity = async (city) => {

    const sql = `
        SELECT w.*, l.city_name 
        FROM weather w 
        JOIN locations l ON w.location_id = l.id 
        WHERE l.city_name = ?
        ORDER BY w.recorded_at DESC
        LIMIT 10
    `;
    const [rows] = await db.execute(sql, [city]);
    return rows;
}

const getWeatherHistoryByCity = async (city) => {
    const sql = `
        SELECT w.*, l.city_name 
        FROM weather w
        JOIN locations l ON w.location_id = l.id
        WHERE l.city_name = ?
        ORDER BY w.recorded_at DESC
    `
    const [rows] = await db.execute(sql, [city])
    return rows
}

const deleteWeatherByCity = async (city) => {
    const sql = `
        DELETE w FROM weather w
        JOIN locations l ON w.location_id = l.id
        WHERE l.city_name = ?
    `;
    const [result] = await db.execute(sql, [city]);
    return result;
};

module.exports = {createWeather,addWeatherData, getAllWeatherHistory,
    getLatestWeatherByCity, 
    getWeatherHistoryByCity, deleteWeatherByCity}
