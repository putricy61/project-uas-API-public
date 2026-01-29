const axios = require('axios')
const cache = require('../config/node-cache')
const iqair = require('../config/iqair')
const pollutantModel = require('../models/pollutant-model')
const locationModel = require('../models/location-model')


const getPollutantByCity = async (req, res) => {
  try {
    const { city, state, country } = req.query;

    if (!city || !state || !country) {
      return res.status(400).json({ message: 'City, state, country wajib diisi' });
    }

    const response = await axios.get('http://api.airvisual.com/v2/city', {
      params: {
        city,
        state,
        country,
        key: process.env.IQAIR_API_KEY
      }
    });

    if (response.data.status !== 'success') {
      return res.status(404).json({ message: 'Data polutan tidak ditemukan' });
    }

    const pollution = response.data.data.current.pollution;

    res.json({
      status: "success",
      aqi_total: pollution.aqius,
      main_pollutant: pollution.mainus,
      pollutants: {
        p2: pollution.mainus === "p2" ? pollution.aqius : "-",
        p1: pollution.mainus === "p1" ? pollution.aqius : "-",
        o3: pollution.mainus === "o3" ? pollution.aqius : "-",
        n2: pollution.mainus === "n2" ? pollution.aqius : "-",
        s2: pollution.mainus === "s2" ? pollution.aqius : "-",
        co: pollution.mainus === "co" ? pollution.aqius : "-"
      }
    });

  } catch (err) {
    console.error('Error di Backend:', err.message);
    res.status(500).json({ 
      message: 'Gagal mengambil data polutan',
      error: err.message 
    });
  }
};

const syncPollutant = async (req, res) => {
    try {
        const { city, state, country, aqi, main_pollutant } = req.body;
        let location = await locationModel.getLocationByCity(city);
        

        if (!location) {
            location = await locationModel.create({ city_name: city, state, country });
        }

        await pollutantModel.addPollutantData(location.id, {
            aqi,
            main_pollutant
        });

        res.status(201).json({ msg: 'Data polutan berhasil disimpan ke database' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Gagal sinkron polutan' });
    }
};

const getLatestPollutant = async (req, res) => {
    const { city } = req.params
    const data = await pollutantModel.getLatestPollutantByCity(city)
    if (!data) return res.status(404).json({ msg: 'No data found' })
    return res.status(200).json(data)
}

const removePollutantHistory = async (req, res) => {
    const { city } = req.params;

    try {
        const result = await pollutantModel.deletePollutantByCity(city);

        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                msg: `Failed to delete. No pollutant history found for ${city}.` 
            });
        }

        return res.status(200).json({ msg: `History for ${city} cleared` });
        
    } catch (error) {
        return res.status(500).json({ msg: 'Server error', error: error.message });
    }
};

module.exports = { getPollutantByCity,syncPollutant,getLatestPollutant,removePollutantHistory }
