'use client'

import { useEffect, useRef, useState } from 'react'
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const lastProductRef = useRef<HTMLDivElement | null>(null)

  const fetchProducts = async (page: number = 1, limit: number = 10, append = false) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/products?page=${page}&limit=${limit}`)

      // handle HTTP errors
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      const incoming: Product[] = Array.isArray(data.products) ? data.products : []

      if (append) {
        setProducts((prev) => {
          const existingIds = new Set(prev.map((p) => p.id))
          const uniqueIncoming = incoming.filter((p) => !existingIds.has(p.id))
          return [...prev, ...uniqueIncoming]
        })
      } else {
        setProducts(incoming)
      }

      setPagination(data.pagination)
    } catch (err: any) {
      console.error('Error fetching products:', err)

      // Friendly error message for end user
      if (err instanceof TypeError && err.message === 'Failed to fetch') {
        setError('Unable to load products. Please check your internet connection and try again.')
      } else {
        setError('Something went wrong while loading products. Please try again later.')
      }
    } finally {
      setLoading(false)
    }
  }

  const loadMore = () => {
    if (!pagination.hasNextPage || loading) return
    fetchProducts(pagination.page + 1, pagination.limit, true)
  }

  // initial load
  useEffect(() => {
    fetchProducts(1, pagination.limit, false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    if (!lastProductRef.current || !pagination.hasNextPage) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) loadMore()
        })
      },
      {
        root: null,
        rootMargin: '300px',
        threshold: 0.1
      }
    )

    const current = lastProductRef.current
    observer.observe(current)

    return () => {
      observer.disconnect()
    }
  }, [products, pagination.hasNextPage]) // re-run whenever products change

  return (
    <div>
      <button
        onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
        className="mb-4 px-4 py-2 bg-sky-600 text-white font-medium rounded hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 transition-colors"
      >
        {viewMode === 'grid' ? 'Switch to List View' : 'Switch to Grid View'}
      </button>
      <div className={viewMode === 'grid'
        ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'
        : 'flex flex-col gap-4'
      }>
        {products.map((product, index) => {
          const isLast = index === products.length - 1
          return (

            <div
              key={product.id}
              className="bg-white w-full mx-auto dark:bg-gray-900 shadow-md rounded-lg overflow-hidden p-4 flex flex-col transform transition-transform duration-300 hover:scale-105 hover:shadow-xl hover:-translate-y-1" ref={isLast ? lastProductRef : null}
            >
              <div className="w-full mx-auto max-w-md">
                {/* Product image */}
                {product.image_url && (
                  <img
                    loading="lazy"
                    src={product.image_url}
                    alt={product.name}
                    className="w-full  aspect-[4/3] overflow-hidden rounded-md mb-4"
                  />
                )}

                {/* Product name */}
                <div className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-1">
                  {product.name}
                </div>

                {/* Product description */}
                <div className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                  {product.description}
                </div>

                {/* Product price */}
                <div className="text-gray-900 dark:text-gray-100 font-medium">
                  {product.price} kr
                </div>

                {/* Optional: Category */}
                <div className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  {product.category} • Stock: {product.stock_quantity}
                </div>
              </div>
            </div>
          )
        })}

        <div aria-live="polite" className="min-h-[1.25rem]">
          {loading && <div className="mt-4">Loading...</div>}
          {error && <div className="mt-4 text-red-600">Error: {error}</div>}
        </div>

        {!loading && pagination.hasNextPage && (
          <div className="mt-6">
            <button
              onClick={loadMore}
              className="px-4 py-2 rounded bg-sky-600 text-white hover:bg-sky-700"
            >
              Load more
            </button>
          </div>
        )}

        {!pagination.hasNextPage && products.length > 0 && (
          <div className="mt-6 text-sm text-gray-600">You have reached the end.</div>
        )}
      </div>

      {/* Debug / optional */}
      {products.length > 0 && (
        <div className="prose prose-pre:bg-green-100 dark:prose-pre:bg-green-900 prose-pre:text-green-900 dark:prose-pre:text-green-100 mt-8 border-t pt-4">
          <h3 className="text-green-900 dark:text-green-100">
            Data structure <i>(this can be removed)</i>
          </h3>

          <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify([products[0]], null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

export default ProductGrid
