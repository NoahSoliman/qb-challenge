import request from 'supertest'
import { app } from '../index'
import { pool } from '../db'

// mock the pool in ../db so health check doesn't hit a real database
jest.mock('../db', () => ({
    pool: { execute: jest.fn() }
}))


describe('GET /health', () => {

    // Silence console.error during tests

    beforeAll(() => {
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterAll(() => {
        (console.error as jest.Mock).mockRestore();
    });

    afterEach(() => {
        jest.clearAllMocks()
    })



    it('returns 200 and ok when db is healthy', async () => {
        ; (pool.execute as jest.Mock).mockResolvedValueOnce([[]])

        const res = await request(app).get('/health')
        expect(res.status).toBe(200)
        expect(res.body).toEqual({ status: 'ok' })
        expect(pool.execute).toHaveBeenCalledWith('SELECT 1+1')
    })

    it('returns 500 when db throws', async () => {
        ; (pool.execute as jest.Mock).mockRejectedValueOnce(new Error('db error'))

        const res = await request(app).get('/health')
        expect(res.status).toBe(500)
        expect(res.body).toEqual({ status: 'error' })
        expect(pool.execute).toHaveBeenCalled()
    })


})
