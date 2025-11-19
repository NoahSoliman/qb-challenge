import request from 'supertest'
import { app } from '../index'

// mock the getProducts controller
jest.mock('../controllers/products', () => ({
    getProducts: jest.fn()
}))

import { getProducts } from '../controllers/products'


describe('GET /products', () => {

    beforeAll(() => {
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });


    afterAll(() => {
        (console.error as jest.Mock).mockRestore();
    });

    afterEach(() => {
        jest.clearAllMocks()
    })


    it('returns paginated products (happy path)', async () => {
        const sample = {
            products: [
                { id: '1', name: 'A', price: '10.00' },
                { id: '2', name: 'B', price: '20.00' }
            ],
            pagination: { page: 1, limit: 2, total: 2, totalPages: 1, hasNextPage: false, hasPrevPage: false }
        }

            ; (getProducts as jest.Mock).mockResolvedValueOnce(sample)

        const res = await request(app).get('/products?page=1&limit=2')
        expect(res.status).toBe(200)
        expect(res.body).toEqual(sample)
        expect(getProducts).toHaveBeenCalledWith(1, 2)
    })

    it('returns 500 when controller throws', async () => {
        ; (getProducts as jest.Mock).mockRejectedValueOnce(new Error('DB failure'))
        const res = await request(app).get('/products')
        expect(res.status).toBe(500)
        expect(res.body).toHaveProperty('error')
        expect(getProducts).toHaveBeenCalled()
    })

   


})
