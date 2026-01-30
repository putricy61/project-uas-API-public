// require('dotenv').config()
// const express = require('express')
// const cors = require('cors')
// const app = express()

// app.use(cors())
// app.use(express.json())

// const airQualityRoute = require('./routes/air-quality-route')
// const pollutantRoute = require('./routes/pollutant-route')
// const weatherRoute = require('./routes/weather-route')
// const locationRoute = require('./routes/location-route')
// const authRoute = require('./routes/auth-route')

// app.use('/api/auth', authRoute)
// app.use('/api/location', locationRoute)
// app.use('/api/weather', weatherRoute)
// app.use('/api/pollutant', pollutantRoute)
// app.use('/api/air-quality', airQualityRoute) 

// const PORT = process.env.PORT || 8000
// app.listen(PORT, () => {
//     console.log(`Server running at http://localhost:${PORT}`)
// })

const request = require('supertest');
const expressApp = require('../app'); // Pastikan path ke app.js benar

describe('UAS Project API Automated Testing', () => {
    let server;
    let agent;
    let token;

    // Timeout ditingkatkan jadi 10 detik karena kadang koneksi DB/API News agak lambat
    jest.setTimeout(10000);

    // Sebelum test dimulai, nyalakan server khusus testing
    beforeAll((done) => {
        server = expressApp.listen(0, () => {
            agent = request.agent(server);
            done();
        });
    });

    // Setelah semua test selesai, matikan server
    afterAll((done) => {
        server.close(done);
    });

    // 1. Test Login
    it('POST /api/auth/login - Harus berhasil login & dapet token', async () => {
        const res = await agent
            .post('/api/auth/login')
            .send({
                email: 'dracoloveputriiiiiii@gmail.com',
                password: 'dracoloveputri'
            });
        
        // Log pembantu jika masih 404 atau 401
        if (res.statusCode !== 200) {
            console.log("LOGIN GAGAL! Status:", res.statusCode);
            console.log("Pesan Error:", res.body);
        }

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        token = res.body.token; 
    });

    // 2. Test Get Profile (Tabel Users)
    it('GET /api/auth/profile - Harus bisa akses profil pakai token', async () => {
        const res = await agent
            .get('/api/auth/profile')
            .set('Authorization', `Bearer ${token}`);
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
    });

    // 3. Test NewsAPI (Integrasi Third Party)
    it('GET /api/articles/all - Harus bisa narik data dari NewsAPI', async () => {
        const res = await agent
            .get('/api/articles/all')
            .set('Authorization', `Bearer ${token}`);
        
        expect(res.statusCode).toEqual(200);
        // Memastikan data artikel yang datang adalah Array
        expect(Array.isArray(res.body.data)).toBe(true);
    });
});
