const cache = require('../config/node-cache')
const iqair = require('../config/iqair')
const db = require('../config/db')
const locationModel = require('../models/location-model')

const getLocation = async (req, res) => {
    const { city, state, country } = req.query;
    try {
        const response = await iqair.get('/city', { params: { city, state, country } });

        const result = locationModel.createLocation(response.data.data);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ msg: 'Gagal cari lokasi di IQAir' });
    }
};

const saveLocation = async (req, res) => {
    try {
        const user_id = req.user.id;
        const locationData = req.body; 

        await locationModel.addLocation(user_id, locationData);

        return res.status(201).json({ msg: 'Lokasi berhasil disimpan!' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Gagal simpan lokasi ke database' });
    }
};


const getUserLocation = async (req, res) => {
    try {
        const user_id = req.user.id;
        const [rows] = await locationModel.getUserLocations(user_id); 
        
        console.log("Data dikirim ke frontend:", rows); 
        return res.status(200).json(rows); 
    } catch (error) {
        return res.status(500).json({ msg: 'Gagal ambil data' });
    }
};

const getLocationDetail = async (req, res) => {

    const cityName = req.params.city; 

    try {
        const sql = `SELECT * FROM locations WHERE city_name = ?`;
        const [rows] = await db.execute(sql, [cityName]);

        if (rows.length === 0) {
            return res.status(404).json({ 
                msg: `Data untuk kota ${cityName} tidak ditemukan di database.` 
            });
        }

        return res.status(200).json(rows[0]);
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}

const deleteUserLocation = async (req, res) => {
    const cityName = req.params.city; 

    const userId = req.user.id; 

    try {

        const sql = `DELETE FROM locations WHERE city_name = ? AND user_id = ?`;
        const [result] = await db.execute(sql, [cityName, userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                msg: `Gagal! Kota ${cityName} tidak ditemukan di daftar lokasi ANDA.` 
            });
        }

        return res.status(200).json({ 
            msg: `Laporan kota ${cityName} milik Anda berhasil dihapus.` 
        });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
};


module.exports = { getLocation,saveLocation,getUserLocation,getLocationDetail,deleteUserLocation }
