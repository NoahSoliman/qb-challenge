'use client'

import { useEffect, useState } from 'react'
import { Product } from '@/types/Product'

interface PaginationData {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async (page: number = 1, limit: number = 10, append = false) => {
    if (loading) return
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/products?page=${page}&limit=${limit}`)
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      const data = await response.json()
      setProducts((prev) => (append ? [...prev, ...data.products] : data.products))
      setPagination(data.pagination)
    } catch (err: any) {
      console.error('Error fetching products:', err)
      setError(err?.message ?? 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts(1, pagination.limit, false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadMore = () => {
    if (!pagination.hasNextPage || loading) return
    const nextPage = pagination.page + 1
    fetchProducts(nextPage, pagination.limit, true)
  }

  return (
    <div>
      <div>
        {products.map((product) => (
          <div key={product.id} className="mb-4">
            <div className="font-medium">{product.name}</div>
            <div>{product.price} kr</div>
          </div>
        ))}

        {loading && <div className="mt-4">Loading...</div>}
        {error && <div className="mt-4 text-red-600">Error: {error}</div>}

        {!loading && pagination.hasNextPage && (
          <div className="mt-6">
            <button onClick={loadMore} className="px-4 py-2 rounded bg-sky-600 text-white hover:bg-sky-700">
              Load more
            </button>
          </div>
        )}

        {!pagination.hasNextPage && products.length > 0 && (
          <div className="mt-6 text-sm text-gray-600">You have reached the end.</div>
        )}
      </div>
    </div>
  )
}

export default ProductGrid
