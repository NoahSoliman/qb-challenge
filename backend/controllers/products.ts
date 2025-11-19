import { pool } from '../db';

export async function getProducts(page: number, limit: number) {
  const offset = (page - 1) * limit;

  const [countResult] = await pool.execute('SELECT COUNT(*) as total FROM products');
  const total = (countResult as any)[0].total;

  const [rows] = await pool.execute(
    `SELECT * FROM products LIMIT ? OFFSET ?`,
    [String(limit), String(offset)]
  );

  const totalPages = Math.ceil(total / limit);

  return {
    products: rows,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}
