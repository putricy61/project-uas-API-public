const db = require('../config/db')

const createLocation = (data) => {
    return {
        city: data.city,
        state: data.state,
        country: data.country,
        latitude: data.location?.coordinates[1] || 0,
        longitude: data.location?.coordinates[0] || 0
    }
}


const addLocation = async (user_id, data) => {
    const query = `
        INSERT INTO locations 
        (user_id, city_name, state, country, latitude, longitude) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    return db.execute(query, [
        user_id, 
        data.city,      
        data.state, 
        data.country, 
        data.latitude, 
        data.longitude
    ]);
}

const getUserLocations = async (user_id) => {
    const query = 'SELECT * FROM locations WHERE user_id = ?';
    return db.execute(query, [user_id]);
};

const getLocationByCity = async (city) => {
    const sql = 'SELECT * FROM locations WHERE city_name = ? LIMIT 1';
    const [rows] = await db.execute(sql, [city]);
    return rows[0]; 
};

const deleteLocation = async (id, user_id) => {
    return db.execute(
        `DELETE FROM locations WHERE id=? AND user_id=?`,
        [id, user_id]
    )
}

module.exports = {
    createLocation,
    addLocation,
    getUserLocations,
    deleteLocation,
    getLocationByCity
}