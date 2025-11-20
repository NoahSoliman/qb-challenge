# API Documentation

This document describes the REST API for the Product Grid backend.

---

## Base URL

```
http://localhost:3001
```

---

## Endpoints

### Health Check

**GET /health**

Check if the server and database are running.

**Response:**

- **200 OK**

```json
{
  "status": "ok"
}
```

- **500 Internal Server Error**

```json
{
  "error": "Internal server error"
}
```

---

### Products

**GET /products**

Retrieve a paginated list of products.

**Query Parameters:**

| Parameter | Type   | Default | Description                     |
|-----------|--------|---------|---------------------------------|
| page      | number | 1       | Page number (must be >=1)       |
| limit     | number | 10      | Number of products per page (1-100) |

**Response:**

```json
{
  "products": [
    {
      "id": "01445abe-b3ac-4ce0-bdf2-4fd0158e2b9f",
      "name": "Practical Cotton Computer",
      "description": "The magenta Sausages combines Ethiopia aesthetics with Krypton-based durability",
      "price": "144.00",
      "image_url": "https://picsum.photos/seed/01445abe-b3ac-4ce0-bdf2-4fd0158e2b9f/800/800",
      "category": "Automotive",
      "stock_quantity": 64
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

**Error Response:**

- **500 Internal Server Error**

```json
{
  "error": "Unable to fetch products at the moment, please try again later."
}
```

---

## Testing

The backend includes automated tests using **Jest** and **Supertest**.

- Health check endpoint (`/health`)
- Products endpoint (`/products`) for pagination, validation, and error handling

**Run Tests:**

```bash
# From the backend directory
npm install
npm test
```

All test files are located in the `tests/` folder.

---

## Notes

- All query parameters are validated and sanitized. Invalid values will fallback to defaults.
- Product IDs are UUID strings.
- Prices are returned as strings.
- Image URLs point to placeholder images.

