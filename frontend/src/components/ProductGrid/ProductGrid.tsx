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

  const lastProductRef = useRef<HTMLDivElement | null>(null)

  const fetchProducts = async (page: number = 1, limit: number = 10, append = false) => {
    if (loading) return
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/products?page=${page}&limit=${limit}`)
      if (!response.ok) throw new Error(`API error: ${response.status}`)
      const data = await response.json()
      const incoming: Product[] = Array.isArray(data.products) ? data.products : []

      if (append) {
        setProducts((prev) => {
          const existingIds = new Set(prev.map((p) => p.id))
          const uniqueIncoming = incoming.filter((p) => !existingIds.has(p.id))
          return [...prev, ...uniqueIncoming]
        })
      } else {
        const map = new Map<string, Product>()
        incoming.forEach((p) => {
          if (!map.has(p.id)) map.set(p.id, p)
        })
        setProducts(Array.from(map.values()))
      }

      setPagination(data.pagination)
    } catch (err: any) {
      console.error('Error fetching products:', err)
      setError(err?.message ?? 'Unknown error')
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
      <div>
        {products.map((product, index) => {
          const isLast = index === products.length - 1
          return (
            <div
              key={product.id}
              className="mb-4"
              ref={isLast ? lastProductRef : null}
            >
              <div className="font-medium">{product.name}</div>
              <div>{product.price} kr</div>
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
