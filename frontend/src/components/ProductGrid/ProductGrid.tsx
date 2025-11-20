'use client'

import { useEffect, useRef, useState } from 'react'
import { Product } from '@/types/Product'
import { PaginationData } from '@/types/PaginationData'


export function ProductGrid() {
  // State to store fetched products
  const [products, setProducts] = useState<Product[]>([])

  // State for pagination info
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  })

  // Loading and error states for user feedback
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // State to toggle between grid and list view
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Ref to the last product for IntersectionObserver (infinite scroll)
  const lastProductRef = useRef<HTMLDivElement | null>(null)

  /**
   * Fetch products from the API
   * @param page Current page to fetch
   * @param limit Number of items per page
   * @param append Whether to append results to existing products
   */
  const fetchProducts = async (page: number = 1, limit: number = 10, append = false) => {
    setLoading(true)      // Show loading spinner
    setError(null)        // Reset previous errors

    try {
      // Fetch data from frontend API route
      const response = await fetch(`/api/products?page=${page}&limit=${limit}`)

      if (!response.ok) {
        const errBody = await response.json().catch(() => null)
        const message = (errBody && (errBody.error || errBody.message)) || `API error: ${response.status} ${response.statusText}`

        // Set friendly error and exit early (do not throw)
        console.warn('Backend returned error:', message)
        setError(message)
        setLoading(false)
        return
      }

      // Try to parse JSON. If parsing fails, show friendly message and exit.
      const data = await response.json().catch((parseErr) => {
        console.error('Failed to parse JSON from /api/products:', parseErr)
        setError('Received invalid response from server.')
        setLoading(false)
        return null
      })
      if (!data) return

      // Defensive: ensure products is an array
      const incoming: Product[] = Array.isArray(data.products) ? data.products : []
      // Append new products to existing ones if needed
      if (append) {
        setProducts((prev) => {
          const existingIds = new Set(prev.map((p) => p.id))
          const uniqueIncoming = incoming.filter((p) => !existingIds.has(p.id))
          return [...prev, ...uniqueIncoming]
        })
      } else {
        setProducts(incoming)
      }

      // Update pagination only if present and valid
      if (data.pagination && typeof data.pagination === 'object') {
        setPagination(data.pagination)
      } else {
        // If backend didn't send pagination, reset to safe defaults
        setPagination((prev) => ({ ...prev, page, limit }))
      }
    } catch (err: any) {
      // Catch unexpected runtime errors (network down, CORS, etc.)
      console.error('Unexpected error when fetching products:', err)

      // Map known low-level errors to friendly messages
      if (err instanceof TypeError && err.message === 'Failed to fetch') {
        setError('Unable to load products. Please check your internet connection and try again.')
      } else {
        setError('Something went wrong while loading products. Please try again later.')
      }
    } finally {
      setLoading(false) // Hide loading spinner
    }
  }

  /**
   * Load more products when user scrolls or clicks "Load more"
   */
  const loadMore = () => {
    if (!pagination.hasNextPage || loading) return
    fetchProducts(pagination.page + 1, pagination.limit, true)
  }

  // Initial load on component mount
  useEffect(() => {
    fetchProducts(1, pagination.limit, false)
  }, [])

  /**
   * Setup IntersectionObserver for infinite scroll
   * Observes the last product element and loads more when it appears in viewport
   */
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
        rootMargin: '300px', // Preload before scrolling to the element
        threshold: 0.1
      }
    )

    const current = lastProductRef.current
    observer.observe(current)

    return () => observer.disconnect()
  }, [products, pagination.hasNextPage])

  return (
    <div>
      {/* Toggle between grid and list view */}
      <button
        onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
        className="mb-4 px-4 py-2 bg-sky-600 text-white font-medium rounded hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 transition-colors"
      >
        {viewMode === 'grid' ? 'Switch to List View' : 'Switch to Grid View'}
      </button>

      {/* Products container */}
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'
            : 'flex flex-col gap-4'
        }
      >
        {products.map((product, index) => {
          const isLast = index === products.length - 1
          return (
            <div
              key={product.id}
              className="bg-white w-full mx-auto my-2 dark:bg-gray-900 shadow-md rounded-lg overflow-hidden p-4 flex flex-col transform transition-transform duration-300 hover:scale-105 hover:shadow-xl hover:-translate-y-1"
              ref={isLast ? lastProductRef : null} // Attach ref to last product
            >
              <div className="w-full mx-auto max-w-md">
                {/* Product image */}
                {product.image_url && (
                  <img
                    loading="lazy"
                    src={product.image_url}
                    alt={product.name}
                    className="w-full aspect-[4/3] overflow-hidden rounded-md mb-4"
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

                {/* Optional: Category and stock */}
                <div className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  {product.category} • Stock: {product.stock_quantity}
                </div>
              </div>
            </div>
          )
        })}

        {/* Loading and error feedback */}
        <div aria-live="polite" className="min-h-[1.25rem]">
          {loading && <div className="mt-4">Loading...</div>}
          {error && <div className="mt-4 text-red-600">Error: {error}</div>}
        </div>

        {/* Load more button for manual loading */}
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

        {/* End of product list */}
        {!pagination.hasNextPage && products.length > 0 && (
          <div className="mt-6 text-sm text-gray-600">You have reached the end.</div>
        )}
      </div>
    </div>
  )
}

export default ProductGrid
