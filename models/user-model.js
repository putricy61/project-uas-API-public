const db = require('../config/db')

const createUser = async (data) => {
    console.log("DATA MASUK KE MODEL:", data); 

    const sql = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
    
    return await db.execute(sql, [
        data.username || null, 
        data.email || null, 
        data.password || null
    ]);
};

const getUserByEmail = async (email) => {
    const sql = `SELECT * FROM users WHERE email = ?`
    const [result] = await db.execute(sql, [email])
    return result[0]
}

const getAllUsers = async () => {
    const sql = `SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC`
    const [rows] = await db.execute(sql)
    return rows
}

const deleteUser = async (id) => {
    const sql = `DELETE FROM users WHERE id = ?`;
    return db.execute(sql, [id]);
}

module.exports = {
    createUser,
    getUserByEmail, getAllUsers, deleteUser
}
