# API Contract: Dish Management

**Date**: 2026-05-31  
**Feature**: Menu Management (Epic 1)  
**Version**: 1.0

## Overview

This document defines the REST API contract between the ServTable frontend and backend for dish management operations. The frontend integrates with these endpoints through the `dishService` layer.

---

## Base URL

```
https://api.servtable.example.com/api/buffets/{buffetId}
```

**Authentication**: All requests require valid JWT token in `Authorization` header
```
Authorization: Bearer <token>
```

---

## Endpoints

### 1. List All Dishes

**Request**

```
GET /api/buffets/{buffetId}/dishes
```

**Parameters**
- `buffetId` (path, required): UUID of the buffet/restaurant
- `limit` (query, optional): Number of results to return (default: 100, max: 500)
- `offset` (query, optional): Pagination offset (default: 0)
- `sortBy` (query, optional): Field to sort by (default: `buffetPosition`; options: `buffetPosition`, `name`, `createdAt`, `updatedAt`)
- `sortOrder` (query, optional): `asc` or `desc` (default: `asc`)

**Request Headers**
```
Content-Type: application/json
Authorization: Bearer <token>
```

**Success Response**

```
HTTP 200 OK
Content-Type: application/json

{
  "dishes": [
    {
      "id": "dish-001",
      "buffetId": "buffet-123",
      "name": "Grilled Salmon",
      "description": "Fresh Atlantic salmon with lemon butter",
      "ingredients": "Salmon, lemon, butter",
      "smallPrice": 18.50,
      "mediumPrice": 24.99,
      "largePrice": 32.00,
      "imageUrl": "https://storage.example.com/buffet-123/dish-001.jpg",
      "buffetPosition": 1,
      "available": true,
      "createdAt": "2026-05-31T10:00:00Z",
      "updatedAt": "2026-05-31T10:00:00Z"
    }
  ],
  "total": 42,
  "limit": 100,
  "offset": 0
}
```

**Error Responses**

```
HTTP 400 Bad Request
{
  "code": "INVALID_PAGINATION",
  "message": "Offset must be non-negative",
  "statusCode": 400
}

HTTP 401 Unauthorized
{
  "code": "UNAUTHORIZED",
  "message": "Invalid or expired token",
  "statusCode": 401
}

HTTP 404 Not Found
{
  "code": "BUFFET_NOT_FOUND",
  "message": "Buffet does not exist",
  "statusCode": 404
}

HTTP 500 Internal Server Error
{
  "code": "INTERNAL_ERROR",
  "message": "An unexpected error occurred",
  "statusCode": 500
}
```

---

### 2. Get Single Dish

**Request**

```
GET /api/buffets/{buffetId}/dishes/{dishId}
```

**Parameters**
- `buffetId` (path, required): UUID of the buffet
- `dishId` (path, required): UUID of the dish

**Request Headers**
```
Content-Type: application/json
Authorization: Bearer <token>
```

**Success Response**

```
HTTP 200 OK
Content-Type: application/json

{
  "id": "dish-001",
  "buffetId": "buffet-123",
  "name": "Grilled Salmon",
  "description": "Fresh Atlantic salmon with lemon butter",
  "ingredients": "Salmon, lemon, butter",
  "smallPrice": 18.50,
  "mediumPrice": 24.99,
  "largePrice": 32.00,
  "imageUrl": "https://storage.example.com/buffet-123/dish-001.jpg",
  "buffetPosition": 1,
  "available": true,
  "createdAt": "2026-05-31T10:00:00Z",
  "updatedAt": "2026-05-31T10:00:00Z"
}
```

**Error Responses**

```
HTTP 404 Not Found
{
  "code": "DISH_NOT_FOUND",
  "message": "Dish does not exist",
  "statusCode": 404
}
```

---

### 3. Create Dish

**Request**

```
POST /api/buffets/{buffetId}/dishes
```

**Parameters**
- `buffetId` (path, required): UUID of the buffet

**Request Headers**
```
Content-Type: application/json
Authorization: Bearer <token>
```

**Request Body**

```json
{
  "name": "Beef Tacos",
  "description": "Seasoned ground beef in crispy shells",
  "ingredients": "Beef, tortilla shells, lettuce, cheese, salsa",
  "smallPrice": 9.99,
  "mediumPrice": 13.99,
  "largePrice": 17.99,
  "buffetPosition": 3,
  "available": true
}
```

**Validation Rules**
- `name`: Required, string, 1-255 characters
- `description`: Optional, string, max 2000 characters
- `ingredients`: Optional, string, max 2000 characters
- `smallPrice`, `mediumPrice`, `largePrice`: Required, number > 0, up to 2 decimal places
- `buffetPosition`: Required, positive integer, must be unique within buffet
- `available`: Optional, boolean (default: true)

**Success Response**

```
HTTP 201 Created
Content-Type: application/json
Location: /api/buffets/{buffetId}/dishes/{dishId}

{
  "id": "dish-new-001",
  "buffetId": "buffet-123",
  "name": "Beef Tacos",
  "description": "Seasoned ground beef in crispy shells",
  "ingredients": "Beef, tortilla shells, lettuce, cheese, salsa",
  "smallPrice": 9.99,
  "mediumPrice": 13.99,
  "largePrice": 17.99,
  "imageUrl": null,
  "buffetPosition": 3,
  "available": true,
  "createdAt": "2026-05-31T14:30:00Z",
  "updatedAt": "2026-05-31T14:30:00Z"
}
```

**Error Responses**

```
HTTP 400 Bad Request (Validation Error)
{
  "code": "VALIDATION_ERROR",
  "message": "All prices must be greater than zero",
  "statusCode": 400
}

HTTP 409 Conflict (Duplicate Position)
{
  "code": "DUPLICATE_POSITION",
  "message": "Buffet position 3 is already occupied",
  "statusCode": 409
}

HTTP 422 Unprocessable Entity (Invalid Field)
{
  "code": "INVALID_INPUT",
  "message": "Field 'smallPrice' must be a number",
  "statusCode": 422
}
```

---

### 4. Update Dish

**Request**

```
PUT /api/buffets/{buffetId}/dishes/{dishId}
```

**Parameters**
- `buffetId` (path, required): UUID of the buffet
- `dishId` (path, required): UUID of the dish

**Request Headers**
```
Content-Type: application/json
Authorization: Bearer <token>
```

**Request Body** (All fields optional; only provided fields are updated)

```json
{
  "name": "Beef Tacos - Premium",
  "description": "Updated description",
  "smallPrice": 10.99,
  "mediumPrice": 14.99,
  "largePrice": 18.99,
  "buffetPosition": 4,
  "available": false
}
```

**Validation Rules**
- Same as Create endpoint
- All fields optional (partial update)
- Cannot update `id`, `buffetId`, `createdAt`, `updatedAt`

**Success Response**

```
HTTP 200 OK
Content-Type: application/json

{
  "id": "dish-001",
  "buffetId": "buffet-123",
  "name": "Beef Tacos - Premium",
  "description": "Updated description",
  "ingredients": "Beef, tortilla shells, lettuce, cheese, salsa",
  "smallPrice": 10.99,
  "mediumPrice": 14.99,
  "largePrice": 18.99,
  "imageUrl": "https://storage.example.com/buffet-123/dish-001.jpg",
  "buffetPosition": 4,
  "available": false,
  "createdAt": "2026-05-31T10:00:00Z",
  "updatedAt": "2026-05-31T15:45:00Z"
}
```

**Error Responses**

```
HTTP 404 Not Found
{
  "code": "DISH_NOT_FOUND",
  "message": "Dish does not exist",
  "statusCode": 404
}

HTTP 409 Conflict
{
  "code": "DUPLICATE_POSITION",
  "message": "Buffet position 4 is already occupied by another dish",
  "statusCode": 409
}

HTTP 400 Bad Request
{
  "code": "VALIDATION_ERROR",
  "message": "All prices must be greater than zero",
  "statusCode": 400
}
```

---

### 5. Delete Dish

**Request**

```
DELETE /api/buffets/{buffetId}/dishes/{dishId}
```

**Parameters**
- `buffetId` (path, required): UUID of the buffet
- `dishId` (path, required): UUID of the dish

**Request Headers**
```
Authorization: Bearer <token>
```

**Success Response**

```
HTTP 204 No Content
```

**Error Responses**

```
HTTP 404 Not Found
{
  "code": "DISH_NOT_FOUND",
  "message": "Dish does not exist",
  "statusCode": 404
}

HTTP 403 Forbidden
{
  "code": "FORBIDDEN",
  "message": "You do not have permission to delete this dish",
  "statusCode": 403
}
```

---

### 6. Upload Dish Image

**Request**

```
POST /api/buffets/{buffetId}/dishes/{dishId}/image
```

**Parameters**
- `buffetId` (path, required): UUID of the buffet
- `dishId` (path, required): UUID of the dish

**Request Headers**
```
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

**Request Body** (Multipart form data)

```
--boundary
Content-Disposition: form-data; name="image"; filename="salmon.jpg"
Content-Type: image/jpeg

[binary image data]
--boundary--
```

**Validation Rules**
- File size: Max 5 MB
- Allowed formats: JPEG, PNG, WebP, GIF
- Minimum dimensions: 200x200 pixels
- Recommended dimensions: 800x600 or larger

**Success Response**

```
HTTP 200 OK
Content-Type: application/json

{
  "imageUrl": "https://storage.example.com/buffet-123/dish-001.jpg",
  "dishId": "dish-001",
  "createdAt": "2026-05-31T16:00:00Z"
}
```

**Error Responses**

```
HTTP 400 Bad Request
{
  "code": "INVALID_FILE",
  "message": "File size exceeds 5 MB limit",
  "statusCode": 400
}

HTTP 415 Unsupported Media Type
{
  "code": "UNSUPPORTED_FORMAT",
  "message": "File format must be JPEG, PNG, WebP, or GIF",
  "statusCode": 415
}

HTTP 404 Not Found
{
  "code": "DISH_NOT_FOUND",
  "message": "Dish does not exist",
  "statusCode": 404
}

HTTP 413 Payload Too Large
{
  "code": "FILE_TOO_LARGE",
  "message": "File size exceeds maximum allowed size",
  "statusCode": 413
}
```

---

## Rate Limiting

All endpoints are rate-limited per user/token:

```
Rate Limit: 1000 requests per hour
Retry-After: Returned in response headers when limit exceeded
```

**Response Header Example**

```
HTTP 429 Too Many Requests
Retry-After: 3600
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1685980800

{
  "code": "RATE_LIMIT_EXCEEDED",
  "message": "API rate limit exceeded. Retry after 1 hour.",
  "statusCode": 429
}
```

---

## Request/Response Standards

### Content Negotiation
- **Request**: Always send `Content-Type: application/json` (except file uploads)
- **Response**: Always returns `Content-Type: application/json` (except file downloads)

### Timestamps
- **Format**: ISO 8601 with timezone (e.g., `2026-05-31T10:00:00Z`)
- **Timezone**: All timestamps in UTC (Z suffix)

### Numeric Precision
- **Prices**: Decimal with 2 decimal places (e.g., `19.99`)
- **Position**: Integer (no decimals)
- **ID**: UUID v4 format (36 characters, e.g., `550e8400-e29b-41d4-a716-446655440000`)

### Error Response Format (Standard)

```json
{
  "code": "ERROR_CODE",
  "message": "Human-readable error description",
  "statusCode": 400,
  "details": {}  // Optional, for additional context
}
```

**Common Error Codes**
- `VALIDATION_ERROR`: Request body fails validation
- `NOT_FOUND`: Resource does not exist
- `UNAUTHORIZED`: Missing or invalid authentication
- `FORBIDDEN`: Authenticated but lacks permission
- `CONFLICT`: Request conflicts with current state (e.g., duplicate position)
- `INTERNAL_ERROR`: Server-side unexpected error

---

## Integration Notes for Frontend

### Service Layer Usage

The frontend service (`dishService.ts`) wraps these endpoints:

```typescript
// Get all dishes
await dishService.getDishes(buffetId);

// Get single dish
await dishService.getDish(buffetId, dishId);

// Create dish
await dishService.createDish(buffetId, dishData);

// Update dish
await dishService.updateDish(buffetId, dishId, updateData);

// Delete dish
await dishService.deleteDish(buffetId, dishId);

// Upload image
await dishService.uploadDishImage(buffetId, dishId, imageFile);
```

### Error Handling

Service wraps all responses in typed error handling:

```typescript
try {
  const dish = await dishService.createDish(buffetId, dishData);
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`[${error.code}] ${error.message}`);
  }
}
```

### Retry Strategy

Recommended client-side retry logic:
- **Status 429 (Rate Limited)**: Respect `Retry-After` header; exponential backoff
- **Status 500-599 (Server Error)**: Exponential backoff (max 3 retries)
- **Status 4xx (Client Error)**: Do not retry (fix the request)

---

## Versioning

This contract is **version 1.0**. Breaking changes will increment the version (e.g., `/v2/buffets/...`).

**Last Updated**: 2026-05-31  
**Status**: Active
