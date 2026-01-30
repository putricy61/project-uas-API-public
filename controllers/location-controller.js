const ArticleModel = require('../models/article-model');
const newsapi = require('../config/newsapi');

// 1. GET: Nampilin semua artikel kesehatan udara (Default)
const getAllArticles = async (req, res) => {
    try {
        const response = await newsapi.get('/everything', {
            params: { 
                q: 'pollutant ', // Pastikan keywordnya umum
                pageSize: 10 // Kita minta 10 artikel langsung ke API-nya
            }
        });
        
        // Cek dulu di console VS Code kamu, ada berapa data yang masuk
        console.log("LOG: JUMLAH BERITA DITEMUKAN:", response.data.articles.length);

        res.status(200).json({ 
            success: true, 
            total: response.data.articles.length,
            data: response.data.articles // Kirim semua yang didapat
        });
    } catch (error) {
        console.error("ERROR NEWSAPI:", error.response?.data || error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};

// 2. POST: Cari artikel berdasarkan input user (Query)
const searchByQuery = async (req, res) => {
    const { keyword } = req.body;
    try {
        const response = await newsapi.get('/everything', {
            params: { q: keyword }
        });
        
        res.status(200).json({ 
            success: true, 
            query: keyword, 
            data: response.data.articles.slice(0, 10) 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
// 3. POST: Simpan ke Favorit (Database)
const saveToFavorite = async (req, res) => {
    const userId = req.user.id;
    const articleData = { ...req.body, user_id: userId };

    try {
        await ArticleModel.saveArticle(articleData);
        res.status(201).json({ success: true, message: "Artikel berhasil masuk ke favorit!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 4. GET: Tampilkan semua dari Database (Biar lengkap CRUD-nya)
const getDbFavorites = async (req, res) => {
    try {
        const rows = await ArticleModel.getFavoriteArticles(req.user.id);
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 5. DELETE: Hapus dari Favorit (Database)
const remove = async (req, res) => {
    try {
        await ArticleModel.deleteArticle(req.params.id, req.user.id);
        res.status(200).json({ success: true, message: "Artikel dihapus dari database" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const getDetail = async (req, res) => {
    const { id } = req.params; // Ambil ID dari URL
    const userId = req.user.id;

    try {
        const article = await ArticleModel.getArticleById(id, userId);

        if (!article) {
            return res.status(404).json({ 
                success: false, 
                message: "Artikel tidak ditemukan atau bukan milik Anda" 
            });
        }

        res.status(200).json({ 
            success: true, 
            data: article 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { getAllArticles, searchByQuery, saveToFavorite, getDbFavorites, remove, getDetail };
// const cache = require('../config/node-cache')
// const iqair = require('../config/iqair')
// const db = require('../config/db')
// const locationModel = require('../models/location-model')

// const getLocation = async (req, res) => {
//     const { city, state, country } = req.query;
//     try {
//         const response = await iqair.get('/city', { params: { city, state, country } });

//         const result = locationModel.createLocation(response.data.data);
//         return res.status(200).json(result);
//     } catch (error) {
//         return res.status(500).json({ msg: 'Gagal cari lokasi di IQAir' });
//     }
// };

// const saveLocation = async (req, res) => {
//     try {
//         const user_id = req.user.id;
//         const locationData = req.body; 

//         await locationModel.addLocation(user_id, locationData);

//         return res.status(201).json({ msg: 'Lokasi berhasil disimpan!' });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ msg: 'Gagal simpan lokasi ke database' });
//     }
// };


// const getUserLocation = async (req, res) => {
//     try {
//         const user_id = req.user.id;
//         const [rows] = await locationModel.getUserLocations(user_id); 
        
//         console.log("Data dikirim ke frontend:", rows); 
//         return res.status(200).json(rows); 
//     } catch (error) {
//         return res.status(500).json({ msg: 'Gagal ambil data' });
//     }
// };

// const getLocationDetail = async (req, res) => {

//     const cityName = req.params.city; 

//     try {
//         const sql = `SELECT * FROM locations WHERE city_name = ?`;
//         const [rows] = await db.execute(sql, [cityName]);

//         if (rows.length === 0) {
//             return res.status(404).json({ 
//                 msg: `Data untuk kota ${cityName} tidak ditemukan di database.` 
//             });
//         }

//         return res.status(200).json(rows[0]);
//     } catch (error) {
//         return res.status(500).json({ msg: error.message });
//     }
// }

// const deleteUserLocation = async (req, res) => {
//     const cityName = req.params.city; 

//     const userId = req.user.id; 

//     try {

//         const sql = `DELETE FROM locations WHERE city_name = ? AND user_id = ?`;
//         const [result] = await db.execute(sql, [cityName, userId]);

//         if (result.affectedRows === 0) {
//             return res.status(404).json({ 
//                 msg: `Gagal! Kota ${cityName} tidak ditemukan di daftar lokasi ANDA.` 
//             });
//         }

//         return res.status(200).json({ 
//             msg: `Laporan kota ${cityName} milik Anda berhasil dihapus.` 
//         });
//     } catch (error) {
//         return res.status(500).json({ msg: error.message });
//     }
// };


// module.exports = { getLocation,saveLocation,getUserLocation,getLocationDetail,deleteUserLocation }
