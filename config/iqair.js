require('dotenv').config()
const axios = require('axios')

const iqair = axios.create({
    baseURL : 'https://api.airvisual.com/v2',
    params : {
        key : process.env.IQAIR_API_KEY
    }
})

module.exports = iqair


newsapi

require('dotenv').config()
const axios = require('axios')

const newsapi = axios.create({
    baseURL: 'https://newsapi.org/v2',
    params: {
        apiKey: process.env.NEWS_API_KEY // Pastikan di .env namanya NEWS_API_KEY
    }
})

module.exports = newsapi


apitest
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
