// const jwt = require('jsonwebtoken')
// const bcrypt = require('bcryptjs')
// const db = require('../config/db');
// const userModel = require('../models/user-model')

// const register = async (req, res) => {
//     const { username, email, password } = req.body

//     if (!username || !email || !password) {
//         return res.status(400).json({ msg: 'All fields are required' })
//     }

//     const hashedPassword = await bcrypt.hash(password, 10)

//     await userModel.createUser({
//         username,
//         email,
//         password: hashedPassword
//     })

//     return res.status(201).json({ msg: 'User registered' })
// }

// const login = async (req, res) => {
//     const { email, password } = req.body

//     if (!email || !password) {
//         return res.status(400).json({ msg: 'Email and password required' })
//     }

//     const user = await userModel.getUserByEmail(email)

//     if (!user) {
//         return res.status(401).json({ msg: 'Invalid credentials' })
//     }

//     const isMatch = await bcrypt.compare(password, user.password)

//     if (!isMatch) {
//         return res.status(401).json({ msg: 'Invalid credentials' })
//     }

//     const token = jwt.sign(
//         { id: user.id, email: user.email },
//         process.env.JWT_SECRET,
//         { expiresIn: process.env.JWT_EXPIRES }
//     )

//     return res.status(200).json({
//         msg: 'Login success',
//         token
//     })
// }

// const getUserReport = async (req, res) => {
//     try {
//         const users = await userModel.getAllUsers();
//         return res.status(200).json(users);
//     } catch (error) {
//         return res.status(500).json({ msg: "Gagal mengambil laporan user" });
//     }
// };

// const removeUser = async (req, res) => {
//     const { id } = req.params;
//     const userRole = req.user.role;

//     try {
//         const sql = `DELETE FROM users WHERE id = ?`;
        
//         const [result] = await db.execute(sql, [id]);
//         if (userRole !== 'admin') {
//         return res.status(403).json({ 
//             msg: "Akses ditolak! Hanya Admin yang boleh menghapus akun." 
//         });
//     }

//         if (result.affectedRows === 0) {
//             return res.status(404).json({ 
//                 msg: `Gagal! User dengan ID ${id} tidak ditemukan.` 
//             });
//         }

//         return res.status(200).json({ 
//             msg: `User dengan ID ${id} berhasil dihapus.` 
//         });

//     } catch (error) {
//         res.status(500).json({ msg: error.message });
//     }
// };

// module.exports = { register, login, getUserReport, removeUser }
const db = require('../config/db');
const UserModel = require('../models/user-model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    const { username, email, password } = req.body;
    console.log("LOG: REQUEST REGISTER MASUK -", email);

    // 1. Validasi Input (Biar nggak ada data kosong masuk ke DB)
    if (!username || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Data tidak lengkap. Username, email, dan password wajib diisi."
        });
    }

    try {
        // 2. Cek apakah email sudah terdaftar (Penting biar gak duplikat)
        const existingUser = await UserModel.getUserByEmail(email); 
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email sudah terdaftar. Gunakan email lain."
            });
        }

        // 3. Enkripsi Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const data = {
            username: username,
            email: email,
            password: hashedPassword
        };

        // 4. Simpan ke Database via Model
        await UserModel.createUser(data);

        return res.status(201).json({
            success: true,
            message: "Akun berhasil didaftarkan. Silakan melakukan login."
        });

    } catch (error) {
        console.error("DEBUG ERROR REGISTER:", error);
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server: " + error.message
        });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    console.log("LOG: REQUEST LOGIN MASUK -", email);

    try {
        // 1. Cari user berdasarkan email
        const user = await UserModel.getUserByEmail(email);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Email tidak ditemukan."
            });
        }

        // 2. Cek Password (bcrypt.compare akan membandingkan password asli vs yang di-hash)
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Password salah!"
            });
        }

        // 3. Jika cocok, buat Token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        // 4. Kirim response balik ke Frontend
        return res.status(200).json({
            success: true,
            message: "Login Berhasil!",
            token: token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error("DEBUG ERROR LOGIN:", error);
        return res.status(500).json({
            success: false,
            message: "Kesalahan server: " + error.message
        });
    }
};

// 1. Fungsi Logout (Memberi tahu client untuk hapus token)
const getProfile = async (req, res) => {
    try {
        const user = await UserModel.getUserById(req.user.id);
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 2. PUT Update Profile: Biar user bisa ganti nama/email
const updateProfile = async (req, res) => {
    const { username, email } = req.body;
    try {
        await UserModel.updateProfile(req.user.id, username, email);
        res.status(200).json({ success: true, message: "Profil berhasil diperbarui!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


const getStats = async (req, res) => {
    const userId = req.user.id;

    try {
        const stats = await UserModel.getUserStats(userId);
        res.status(200).json({ 
            success: true, 
            message: "Statistik riwayat user berhasil diambil",
            data: stats 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


const logout = async (req, res) => {
    try {
        // Karena kita pakai JWT, server tidak menyimpan session.
        // Kita cukup mengirim respon sukses, dan memberitahu client 
        // untuk menghapus token dari storage mereka.
        res.status(200).json({ 
            success: true, 
            message: "Logout berhasil. Silakan hapus token dari local storage Anda." 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // ... logika insert ke DB ...

        return res.status(201).json({
            success: true,
            message: "User berhasil didaftarkan!"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server",
            error: error.message
        });
    }
};
module.exports = { register, login, logout, updateProfile, getProfile, getStats };// const jwt = require('jsonwebtoken')
// const bcrypt = require('bcryptjs')
// const db = require('../config/db');
// const userModel = require('../models/user-model')

// const register = async (req, res) => {
//     const { username, email, password } = req.body

//     if (!username || !email || !password) {
//         return res.status(400).json({ msg: 'All fields are required' })
//     }

//     const hashedPassword = await bcrypt.hash(password, 10)

//     await userModel.createUser({
//         username,
//         email,
//         password: hashedPassword
//     })

//     return res.status(201).json({ msg: 'User registered' })
// }

// const login = async (req, res) => {
//     const { email, password } = req.body

//     if (!email || !password) {
//         return res.status(400).json({ msg: 'Email and password required' })
//     }

//     const user = await userModel.getUserByEmail(email)

//     if (!user) {
//         return res.status(401).json({ msg: 'Invalid credentials' })
//     }

//     const isMatch = await bcrypt.compare(password, user.password)

//     if (!isMatch) {
//         return res.status(401).json({ msg: 'Invalid credentials' })
//     }

//     const token = jwt.sign(
//         { id: user.id, email: user.email },
//         process.env.JWT_SECRET,
//         { expiresIn: process.env.JWT_EXPIRES }
//     )

//     return res.status(200).json({
//         msg: 'Login success',
//         token
//     })
// }

// const getUserReport = async (req, res) => {
//     try {
//         const users = await userModel.getAllUsers();
//         return res.status(200).json(users);
//     } catch (error) {
//         return res.status(500).json({ msg: "Gagal mengambil laporan user" });
//     }
// };

// const removeUser = async (req, res) => {
//     const { id } = req.params;
//     const userRole = req.user.role;

//     try {
//         const sql = `DELETE FROM users WHERE id = ?`;
        
//         const [result] = await db.execute(sql, [id]);
//         if (userRole !== 'admin') {
//         return res.status(403).json({ 
//             msg: "Akses ditolak! Hanya Admin yang boleh menghapus akun." 
//         });
//     }

//         if (result.affectedRows === 0) {
//             return res.status(404).json({ 
//                 msg: `Gagal! User dengan ID ${id} tidak ditemukan.` 
//             });
//         }

//         return res.status(200).json({ 
//             msg: `User dengan ID ${id} berhasil dihapus.` 
//         });

//     } catch (error) {
//         res.status(500).json({ msg: error.message });
//     }
// };

// module.exports = { register, login, getUserReport, removeUser }
