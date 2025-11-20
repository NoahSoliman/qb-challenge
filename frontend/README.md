# Getting Started

1. Click the green "Use this template" button on GitHub to create your own repository.

2. Install dependencies using your preferred package manager:
   ```bash
   # Using pnpm (recommended)
   pnpm install

   # Using npm
   npm install

   # Using bun
   bun install
   ```

3. Start the development server:
   ```bash
   # Using pnpm
   pnpm dev

   # Using npm
   npm run dev

   # Using bun
   bun dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser and follow the steps to complete the challenge.

5. When you're satisfied with your solution:
   - Push your code to GitHub
   - Ensure your repository is public
   - Share the repository URL with us

---

## Frontend Overview

This frontend is a **Next.js 15** app with React, TypeScript, and Tailwind CSS. It fetches products from the backend and displays them in a **product grid** with infinite scrolling. You can also toggle between grid and list view.

---



## Features

- Product Grid with optional List view
- Infinite scrolling to load more products
- Loading and error states handling
- Tailwind CSS styling
- TypeScript support

---

## ProductGrid Component

Located in `/components/ProductGrid.tsx`, this component handles:

- Fetching products from `/api/products`
- Appending new products for infinite scrolling
- Handling loading and error states
- Switching between grid and list view

### Example Usage

```tsx
<ProductGrid />
```


## API Route `/api/products`

The frontend uses an API route to fetch products from the backend.

- **GET `/api/products?page={page}&limit={limit}`**

**Query Parameters:**

| Parameter | Type   | Default | Description                       |
|-----------|--------|---------|-----------------------------------|
| page      | number | 1       | Page number to fetch               |
| limit     | number | 10      | Number of products per page        |

**Response:**

```json
{
  "products": [
    {
      "id": "uuid",
      "name": "Product Name",
      "description": "Product description",
      "price": "Price as string",
      "image_url": "URL to image",
      "category": "Category name",
      "stock_quantity": 42
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

**Note:** The frontend uses pagination internally for infinite scroll, but it did not display page numbers to the user.

---

## Testing

- Manual testing can be done by scrolling the product grid and checking loading/error states.
- Backend tests are in `/backend` and can be run with `npm test`.
- Ensure both backend and frontend are running to test infinite scroll fully.

---

## Code Comments

- All functions and major blocks in `ProductGrid.tsx` are commented for clarity.
- Key points:
  - `fetchProducts()` handles API calls, loading, and errors.
  - `loadMore()` appends new products when the user scrolls.
  - `viewMode` toggles between grid and list display.

---

**Best of luck!**

## Need Help?

If you have any questions or run into problems, please contact Noah.soliman@outlook.com `:)`

