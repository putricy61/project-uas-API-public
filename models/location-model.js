const db = require('../config/db');

// 1. Fungsi untuk menyimpan artikel ke database
const saveArticle = async (data) => {
    console.log("LOG: MENYIMPAN ARTIKEL KE DATABASE");
    const sql = `INSERT INTO favorite_articles 
    (user_id, title, author, description, url, url_to_image, published_at) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
    return await db.execute(sql, [
        data.user_id,         // Dari req.user.id
        data.title,           // Judul artikel
        data.author || 'Anonim', 
        data.description || '', 
        data.url,             // Link asli berita
        data.urlToImage || '', // Link gambar berita
        data.publishedAt || null
    ]);
};

// 2. Fungsi untuk menampilkan semua artikel favorit milik user tertentu
const getFavoriteArticles = async (userId) => {
    const sql = `SELECT * FROM favorite_articles WHERE user_id = ? ORDER BY created_at DESC`;
    const [rows] = await db.execute(sql, [userId]);
    return rows;
};

// 3. Fungsi untuk menghapus artikel dari favorit
const deleteArticle = async (id, userId) => {
    const sql = `DELETE FROM favorite_articles WHERE id = ? AND user_id = ?`;
    return await db.execute(sql, [id, userId]);
};
const getArticleById = async (id, userId) => {
    const sql = `SELECT * FROM favorite_articles WHERE id = ? AND user_id = ?`;
    const [rows] = await db.execute(sql, [id, userId]);
    return rows[0]; // Kita ambil indeks ke-0 karena cuma 1 data
};

module.exports = { 
    saveArticle, 
    getFavoriteArticles, 
    deleteArticle,
    getArticleById
};
// const db = require('../config/db')

// const createLocation = (data) => {
//     return {
//         city: data.city,
//         state: data.state,
//         country: data.country,
//         latitude: data.location?.coordinates[1] || 0,
//         longitude: data.location?.coordinates[0] || 0
//     }
// }


// const addLocation = async (user_id, data) => {
//     const query = `
//         INSERT INTO locations 
//         (user_id, city_name, state, country, latitude, longitude) 
//         VALUES (?, ?, ?, ?, ?, ?)
//     `;
//     return db.execute(query, [
//         user_id, 
//         data.city,      
//         data.state, 
//         data.country, 
//         data.latitude, 
//         data.longitude
//     ]);
// }

// const getUserLocations = async (user_id) => {
//     const query = 'SELECT * FROM locations WHERE user_id = ?';
//     return db.execute(query, [user_id]);
// };

// const getLocationByCity = async (city) => {
//     const sql = 'SELECT * FROM locations WHERE city_name = ? LIMIT 1';
//     const [rows] = await db.execute(sql, [city]);
//     return rows[0]; 
// };

// const deleteLocation = async (id, user_id) => {
//     return db.execute(
//         `DELETE FROM locations WHERE id=? AND user_id=?`,
//         [id, user_id]
//     )
// }

// module.exports = {
//     createLocation,
//     addLocation,
//     getUserLocations,
//     deleteLocation,
//     getLocationByCity
// }
