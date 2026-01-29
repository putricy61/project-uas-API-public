const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('../config/db');
const userModel = require('../models/user-model')

const register = async (req, res) => {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
        return res.status(400).json({ msg: 'All fields are required' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await userModel.createUser({
        username,
        email,
        password: hashedPassword
    })

    return res.status(201).json({ msg: 'User registered' })
}

const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ msg: 'Email and password required' })
    }

    const user = await userModel.getUserByEmail(email)

    if (!user) {
        return res.status(401).json({ msg: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        return res.status(401).json({ msg: 'Invalid credentials' })
    }

    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES }
    )

    return res.status(200).json({
        msg: 'Login success',
        token
    })
}

const getUserReport = async (req, res) => {
    try {
        const users = await userModel.getAllUsers();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ msg: "Gagal mengambil laporan user" });
    }
};

const removeUser = async (req, res) => {
    const { id } = req.params;
    const userRole = req.user.role;

    try {
        const sql = `DELETE FROM users WHERE id = ?`;
        
        const [result] = await db.execute(sql, [id]);
        if (userRole !== 'admin') {
        return res.status(403).json({ 
            msg: "Akses ditolak! Hanya Admin yang boleh menghapus akun." 
        });
    }

        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                msg: `Gagal! User dengan ID ${id} tidak ditemukan.` 
            });
        }

        return res.status(200).json({ 
            msg: `User dengan ID ${id} berhasil dihapus.` 
        });

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

module.exports = { register, login, getUserReport, removeUser }
