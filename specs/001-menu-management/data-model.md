# Data Model: Menu Management

**Date**: 2026-05-31  
**Feature**: Menu Management (Epic 1)

## Entity: Dish

### Overview
Represents a single menu item that can be created, updated, and deleted by restaurant managers. Dishes have multiple price tiers (small, medium, large) to support portion-based pricing. Each dish has a unique position within the buffet display order.

### Properties

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `id` | string (UUID) | Yes | Unique | Unique identifier for the dish |
| `buffetId` | string (UUID) | Yes | Foreign key | Identifies the buffet/restaurant this dish belongs to |
| `name` | string | Yes | Min length 1, max 255 | Human-readable dish name |
| `description` | string | No | Max 2000 | Detailed description of dish contents and preparation |
| `ingredients` | string | No | Max 2000 | Comma-separated or formatted list of ingredients |
| `smallPrice` | decimal | Yes | > 0, precision 2 | Price for small portion (e.g., 12.50) |
| `mediumPrice` | decimal | Yes | > 0, precision 2 | Price for medium portion |
| `largePrice` | decimal | Yes | > 0, precision 2 | Price for large portion |
| `imageUrl` | string | No | Valid URL | Reference to dish image (stored on backend file service) |
| `buffetPosition` | integer | Yes | > 0, unique per buffet | Display order in menu (1, 2, 3, ...) |
| `available` | boolean | Yes | Default: true | Whether dish is currently available for order |
| `createdAt` | ISO 8601 timestamp | Yes | Immutable | When dish was created |
| `updatedAt` | ISO 8601 timestamp | Yes | Auto-updated | When dish was last modified |

### Validation Rules

1. **Name Required**: Cannot be empty; must be at least 1 character
2. **Prices Positive**: All three prices (small, medium, large) MUST be greater than zero
3. **Buffet Position Unique**: Within a single buffet, no two dishes can have the same position
4. **Buffet Position Positive**: Position must be greater than zero (no zero or negative values)
5. **Image Optional**: Image can be null/undefined initially; can be added or replaced later
6. **Availability Status**: Defaults to `available: true`; can be toggled on/off

### Business Rules

1. **Unavailable Dishes Visible**: When `available: false`, dish remains visible in menus with availability indicator; not hidden from view
2. **Image Replacement**: Uploading a new image replaces the previous image entirely (no image versioning/history)
3. **Price Independence**: Small, medium, large prices are independent; no required relationship (e.g., small can cost more than large if restaurant chooses)
4. **Deletion**: Deleted dishes are permanently removed; no soft-delete or archive
5. **Position Management**: Positions do not auto-renumber; manager must explicitly assign/reassign positions to maintain order

### Sample Data

```json
{
  "id": "dish-001",
  "buffetId": "buffet-123",
  "name": "Grilled Salmon",
  "description": "Fresh Atlantic salmon fillet grilled with lemon butter sauce",
  "ingredients": "Salmon, lemon, butter, herbs",
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

---

## Entity: Buffet (Parent Context)

### Overview
Represents a restaurant or buffet location. Dishes belong to a buffet. Managers have permission to edit dishes within their assigned buffet(s).

### Properties (Minimal, for Dish Context)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string (UUID) | Yes | Unique buffet identifier |
| `name` | string | Yes | Restaurant/buffet name |
| `managerId` | string (UUID) | Yes | User with permission to edit dishes |

**Note**: Full Buffet entity is out of scope for this epic; only listed for context of foreign key relationship.

---

## Zod Schema Definitions

### Dish Schema (Runtime Validation)

```typescript
// In src/services/dishes/schemas.ts

import { z } from 'zod';

export const DishSchema = z.object({
  id: z.string().uuid(),
  buffetId: z.string().uuid(),
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().max(2000).optional(),
  ingredients: z.string().max(2000).optional(),
  smallPrice: z.number().positive('Price must be greater than zero'),
  mediumPrice: z.number().positive('Price must be greater than zero'),
  largePrice: z.number().positive('Price must be greater than zero'),
  imageUrl: z.string().url().optional(),
  buffetPosition: z.number().int().positive('Position must be greater than zero'),
  available: z.boolean().default(true),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Dish = z.infer<typeof DishSchema>;

// Create operation schema (excludes id, timestamps)
export const CreateDishSchema = DishSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateDishInput = z.infer<typeof CreateDishSchema>;

// Update operation schema (all fields optional except buffetId)
export const UpdateDishSchema = DishSchema.omit({
  id: true,
  buffetId: true,
  createdAt: true,
  updatedAt: true,
}).partial();

export type UpdateDishInput = z.infer<typeof UpdateDishSchema>;

// List response schema
export const DishListSchema = z.object({
  dishes: z.array(DishSchema),
  total: z.number().int().nonnegative(),
});

export type DishListResponse = z.infer<typeof DishListSchema>;

// Single dish response
export const DishResponseSchema = DishSchema;
export type DishResponse = z.infer<typeof DishResponseSchema>;

// Error response (generic)
export const ErrorResponseSchema = z.object({
  code: z.string(),
  message: z.string(),
  statusCode: z.number().int(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
```

### Form Schema (React Hook Form)

```typescript
// In src/services/dishes/schemas.ts (continued)

// Form schema for Create/Edit operations
export const DishFormSchema = CreateDishSchema.pick({
  name: true,
  description: true,
  ingredients: true,
  smallPrice: true,
  mediumPrice: true,
  largePrice: true,
  buffetPosition: true,
  available: true,
  // imageUrl handled separately via file upload
});

export type DishFormInput = z.infer<typeof DishFormSchema>;
```

---

## Relationships & Dependencies

### Dish → Buffet
- **Type**: Many-to-One
- **Direction**: Each Dish belongs to exactly one Buffet
- **Constraint**: Foreign key `buffetId` on Dish references Buffet `id`
- **Business Impact**: Deleting a buffet would orphan its dishes (out of scope for this epic)

### Dish → Image (Implicit)
- **Type**: One-to-One (when image exists)
- **Storage**: Backend manages image files; frontend stores URL reference only
- **Lifecycle**: Image deleted/replaced when `imageUrl` updated

### User → Dish (Via Buffet)
- **Type**: Many-to-Many (through Buffet → Manager relationship)
- **Authorization**: Users can only create/edit dishes in buffets they manage
- **Implementation**: Backend enforces via JWT/session token; frontend assumes authorized user

---

## State Transitions

### Dish Lifecycle

```
[Not Exists] 
    ↓ (Create)
[Exists] → [Available/Unavailable]
    ↓ (Update fields)
[Exists] → [Available/Unavailable] (can toggle)
    ↓ (Delete)
[Deleted] (permanently removed)
```

### Availability Transitions
```
[Available] ←→ [Unavailable] (toggle available flag)
```

**No auto-transitions**: Manager explicitly controls all state changes.

---

## Storage & Persistence

### Frontend State Management
- **Server State**: React Query caches dishes in memory (default stale time: 5 minutes)
- **Form State**: React Hook Form manages form field values (not persisted)
- **No local storage**: All persistent data lives on backend

### Backend Storage (Out of Scope)
- **Assumption**: Backend stores dishes in relational database (SQL)
- **Assumption**: Images stored in blob storage service (AWS S3, Azure Blob, etc.)
- **Assumption**: Data is backed up and recoverable

---

## API Response Examples

### List Dishes Response
```json
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
    },
    {
      "id": "dish-002",
      "buffetId": "buffet-123",
      "name": "Vegetarian Lasagna",
      "description": "Layered pasta with ricotta and vegetables",
      "ingredients": "Pasta, ricotta, spinach, tomato sauce",
      "smallPrice": 14.50,
      "mediumPrice": 18.99,
      "largePrice": 24.00,
      "imageUrl": "https://storage.example.com/buffet-123/dish-002.jpg",
      "buffetPosition": 2,
      "available": false,
      "createdAt": "2026-05-31T10:05:00Z",
      "updatedAt": "2026-05-31T12:00:00Z"
    }
  ],
  "total": 2
}
```

### Create Dish Request/Response
```json
// Request payload
{
  "buffetId": "buffet-123",
  "name": "Beef Tacos",
  "description": "Seasoned ground beef in crispy shells",
  "ingredients": "Beef, tortilla shells, lettuce, cheese, salsa",
  "smallPrice": 9.99,
  "mediumPrice": 13.99,
  "largePrice": 17.99,
  "buffetPosition": 3,
  "available": true
}

// Response (includes id, timestamps)
{
  "id": "dish-003",
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

### Update Dish Request
```json
{
  "name": "Beef Tacos - Premium",
  "smallPrice": 10.99,
  "mediumPrice": 14.99,
  "largePrice": 18.99
  // Other fields omitted if not changing
}
```

### Error Response
```json
{
  "code": "VALIDATION_ERROR",
  "message": "All prices must be greater than zero",
  "statusCode": 400
}
```
