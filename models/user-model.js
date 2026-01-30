const db = require('../config/db');

const createUser = async (data) => {
    console.log("LOG: PROSES REGISTER USER");
    const sql = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
return await db.execute(sql, [
    data.username || null, 
    data.email || null, 
    data.password || null
]);
};

const getUserByEmail = async (email) => {
    const sql = `SELECT * FROM users WHERE email = ?`;
    const [result] = await db.execute(sql, [email]);
    return result[0]; // Ini akan mengembalikan data user atau 'undefined'
};
const getUserById = async (id) => {
    const [rows] = await db.execute('SELECT id, username, email FROM users WHERE id = ?', [id]);
    return rows[0];
};

// Update username dan email
const updateProfile = async (id, username, email) => {
    return await db.execute(
        'UPDATE users SET username = ?, email = ? WHERE id = ?', 
        [username, email, id]
    );
};

const getUserStats = async (userId) => {
    // Menghitung total data di 3 tabel berbeda
    const [aqi] = await db.execute('SELECT COUNT(*) as total FROM air_quality WHERE user_id = ?', [userId]);
    const [weather] = await db.execute('SELECT COUNT(*) as total FROM weather WHERE user_id = ?', [userId]);
    const [articles] = await db.execute('SELECT COUNT(*) as total FROM favorite_articles WHERE user_id = ?', [userId]);
    
    return {
        total_air_quality: aqi[0].total,
        total_weather: weather[0].total,
        total_articles: articles[0].total,
        overall_total: aqi[0].total + weather[0].total + articles[0].total
    };
};

module.exports = { createUser, getUserByEmail, getUserById, updateProfile, getUserStats };
// const db = require('../config/db')

// const createUser = async (data) => {
//     console.log("DATA MASUK KE MODEL:", data); 

//     const sql = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
    
//     return await db.execute(sql, [
//         data.username || null, 
//         data.email || null, 
//         data.password || null
//     ]);
// };

// const getUserByEmail = async (email) => {
//     const sql = `SELECT * FROM users WHERE email = ?`
//     const [result] = await db.execute(sql, [email])
//     return result[0]
// }

// const getAllUsers = async () => {
//     const sql = `SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC`
//     const [rows] = await db.execute(sql)
//     return rows
// }

// const deleteUser = async (id) => {
//     const sql = `DELETE FROM users WHERE id = ?`;
//     return db.execute(sql, [id]);
// }

// module.exports = {
//     createUser,
//     getUserByEmail, getAllUsers, deleteUser
// }
