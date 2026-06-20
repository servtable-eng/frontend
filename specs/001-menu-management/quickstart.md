# Quickstart: Menu Management Development

**Date**: 2026-05-31  
**Feature**: Menu Management (Epic 1)

## Quick Start Guide

This guide walks you through setting up the Menu Management feature development environment and running the first working example.

---

## Prerequisites

- Node.js 16+ and npm/yarn installed
- Existing ServTable frontend repository cloned
- React Query and React Hook Form already in `package.json`
- Zod already installed (`npm install zod`)
- Basic familiarity with React, TypeScript, and hooks

---

## Step 1: Create Service Layer

### 1a. Create Zod Schemas

Create file: `src/services/dishes/schemas.ts`

```typescript
import { z } from 'zod';

// Core Dish entity schema
export const DishSchema = z.object({
  id: z.string().uuid(),
  buffetId: z.string().uuid(),
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().max(2000).optional(),
  ingredients: z.string().max(2000).optional(),
  smallPrice: z.number().positive('Price must be greater than zero'),
  mediumPrice: z.number().positive('Price must be greater than zero'),
  largePrice: z.number().positive('Price must be greater than zero'),
  imageUrl: z.string().url().optional().nullable(),
  buffetPosition: z.number().int().positive('Position must be positive'),
  available: z.boolean().default(true),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Dish = z.infer<typeof DishSchema>;

// Create operation (omits id, timestamps)
export const CreateDishSchema = DishSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateDishInput = z.infer<typeof CreateDishSchema>;

// Update operation (all optional except buffetId)
export const UpdateDishSchema = DishSchema.omit({
  id: true,
  buffetId: true,
  createdAt: true,
  updatedAt: true,
}).partial();

export type UpdateDishInput = z.infer<typeof UpdateDishSchema>;

// List response
export const DishListSchema = z.object({
  dishes: z.array(DishSchema),
  total: z.number().int().nonnegative(),
  limit: z.number().int().positive(),
  offset: z.number().int().nonnegative(),
});

export type DishListResponse = z.infer<typeof DishListSchema>;
```

### 1b. Create API Service

Create file: `src/services/dishes/dishService.ts`

```typescript
import { z } from 'zod';
import {
  DishSchema,
  CreateDishInput,
  UpdateDishInput,
  DishListSchema,
  type Dish,
  type DishListResponse,
} from './schemas';

const API_BASE = process.env.REACT_APP_API_URL || 'https://api.servtable.example.com/api';

class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const dishService = {
  async getDishes(buffetId: string): Promise<Dish[]> {
    const response = await fetch(`${API_BASE}/buffets/${buffetId}/dishes`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new ApiError(error.code, error.message, response.status);
    }

    const data = await response.json();
    const validated = DishListSchema.parse(data);
    return validated.dishes;
  },

  async getDish(buffetId: string, dishId: string): Promise<Dish> {
    const response = await fetch(`${API_BASE}/buffets/${buffetId}/dishes/${dishId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new ApiError(error.code, error.message, response.status);
    }

    const data = await response.json();
    return DishSchema.parse(data);
  },

  async createDish(buffetId: string, input: CreateDishInput): Promise<Dish> {
    // Validate input
    const validatedInput = CreateDishSchema.parse(input);

    const response = await fetch(`${API_BASE}/buffets/${buffetId}/dishes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedInput),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new ApiError(error.code, error.message, response.status);
    }

    const data = await response.json();
    return DishSchema.parse(data);
  },

  async updateDish(
    buffetId: string,
    dishId: string,
    input: UpdateDishInput,
  ): Promise<Dish> {
    // Validate input
    const validatedInput = UpdateDishSchema.parse(input);

    const response = await fetch(`${API_BASE}/buffets/${buffetId}/dishes/${dishId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedInput),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new ApiError(error.code, error.message, response.status);
    }

    const data = await response.json();
    return DishSchema.parse(data);
  },

  async deleteDish(buffetId: string, dishId: string): Promise<void> {
    const response = await fetch(`${API_BASE}/buffets/${buffetId}/dishes/${dishId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new ApiError(error.code, error.message, response.status);
    }
  },

  async uploadDishImage(
    buffetId: string,
    dishId: string,
    imageFile: File,
  ): Promise<string> {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch(
      `${API_BASE}/buffets/${buffetId}/dishes/${dishId}/image`,
      {
        method: 'POST',
        body: formData,
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new ApiError(error.code, error.message, response.status);
    }

    const data = await response.json();
    return data.imageUrl;
  },
};

export type { Dish, CreateDishInput, UpdateDishInput, DishListResponse };
export { ApiError };
```

---

## Step 2: Create Custom Hooks

### 2a. Query Hook - Fetch Dishes

Create file: `src/hooks/useDishes.ts`

```typescript
import { useQuery } from '@tanstack/react-query';
import { dishService, type Dish } from '@/services/dishes/dishService';

export const dishQueryKeys = {
  all: ['dishes'] as const,
  lists: () => [...dishQueryKeys.all, 'list'] as const,
  list: (buffetId: string) => [...dishQueryKeys.lists(), buffetId] as const,
  detail: (dishId: string) => [...dishQueryKeys.all, 'detail', dishId] as const,
};

export function useDishes(buffetId: string) {
  return useQuery<Dish[]>({
    queryKey: dishQueryKeys.list(buffetId),
    queryFn: () => dishService.getDishes(buffetId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
```

### 2b. Mutation Hook - Create Dish

Create file: `src/hooks/useCreateDish.ts`

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dishService, type CreateDishInput, type Dish } from '@/services/dishes/dishService';
import { dishQueryKeys } from './useDishes';

export function useCreateDish(buffetId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateDishInput) => dishService.createDish(buffetId, input),
    onSuccess: () => {
      // Invalidate dishes list query to trigger refetch
      queryClient.invalidateQueries({ queryKey: dishQueryKeys.list(buffetId) });
    },
  });
}
```

### 2c. Mutation Hook - Update Dish

Create file: `src/hooks/useUpdateDish.ts`

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dishService, type UpdateDishInput, type Dish } from '@/services/dishes/dishService';
import { dishQueryKeys } from './useDishes';

export function useUpdateDish(buffetId: string, dishId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateDishInput) => dishService.updateDish(buffetId, dishId, input),
    onSuccess: () => {
      // Invalidate both the specific dish and the list
      queryClient.invalidateQueries({ queryKey: dishQueryKeys.detail(dishId) });
      queryClient.invalidateQueries({ queryKey: dishQueryKeys.list(buffetId) });
    },
  });
}
```

### 2d. Mutation Hook - Delete Dish

Create file: `src/hooks/useDeleteDish.ts`

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dishService } from '@/services/dishes/dishService';
import { dishQueryKeys } from './useDishes';

export function useDeleteDish(buffetId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dishId: string) => dishService.deleteDish(buffetId, dishId),
    onSuccess: () => {
      // Invalidate dishes list to remove deleted dish
      queryClient.invalidateQueries({ queryKey: dishQueryKeys.list(buffetId) });
    },
  });
}
```

### 2e. Barrel Export

Create file: `src/hooks/index.ts`

```typescript
export { useDishes, dishQueryKeys } from './useDishes';
export { useCreateDish } from './useCreateDish';
export { useUpdateDish } from './useUpdateDish';
export { useDeleteDish } from './useDeleteDish';
export { useMobile } from './use-mobile';
export { useToast } from './use-toast';
```

---

## Step 3: Use Hooks in Components

### Example: List Dishes Component

```typescript
import { useDishes } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function DishesList({ buffetId }: { buffetId: string }) {
  const { data: dishes, isLoading, error } = useDishes(buffetId);

  if (isLoading) return <div>Loading dishes...</div>;
  if (error) return <div>Error loading dishes</div>;

  return (
    <div className="grid gap-4">
      {dishes?.map((dish) => (
        <Card key={dish.id} className="p-4">
          <h3 className="font-bold">{dish.name}</h3>
          <p className="text-sm text-gray-600">{dish.description}</p>
          <div className="mt-2 flex gap-2">
            <span>${dish.smallPrice}</span>
            <span>${dish.mediumPrice}</span>
            <span>${dish.largePrice}</span>
          </div>
          {dish.imageUrl && <img src={dish.imageUrl} alt={dish.name} className="mt-2 h-32 w-32" />}
          {!dish.available && <span className="text-red-600">Unavailable</span>}
        </Card>
      ))}
    </div>
  );
}
```

---

## Step 4: Environment Configuration

### Create `.env.local`

```
REACT_APP_API_URL=https://api.servtable.example.com/api
```

For development/testing:
```
REACT_APP_API_URL=http://localhost:3001/api
```

---

## Testing the Implementation

### 1. Start Development Server

```bash
npm run dev
```

### 2. Check Browser Console

Look for successful API calls to `/api/buffets/{buffetId}/dishes`

### 3. Verify Data Flow

- Hooks fetch data correctly
- Components render dishes
- Create/update/delete mutations work
- Cache invalidation refreshes the list

### 4. Test Error Scenarios

- Invalid buffet ID (404)
- Missing authentication (401)
- Invalid dish data (400)
- Duplicate position (409)

---

## Next Steps

1. **Create Forms**: Build Create/Edit dish forms using React Hook Form + Zod
2. **Add UI Components**: Implement dish cards, modals, dialogs using existing UI library
3. **Implement Image Upload**: Add image upload UI with progress indication
4. **Add Error Handling**: Display user-friendly error messages from API
5. **Write Tests**: Unit tests for service, integration tests for hooks
6. **Performance**: Add loading states, skeletons, pagination if needed

---

## File Structure Checklist

Verify you've created all files:

```
✓ src/services/dishes/
  ✓ dishService.ts
  ✓ schemas.ts
  
✓ src/hooks/
  ✓ useDishes.ts
  ✓ useCreateDish.ts
  ✓ useUpdateDish.ts
  ✓ useDeleteDish.ts
  ✓ index.ts (barrel export)

✓ .env.local (API URL config)

✓ specs/001-menu-management/
  ✓ plan.md
  ✓ research.md
  ✓ data-model.md
  ✓ contracts/dishes-api.md
```

---

## Common Issues & Solutions

### Issue: "Module not found" for services
**Solution**: Ensure `tsconfig.json` has path alias `@/` pointing to `src/`

### Issue: React Query not working
**Solution**: Verify QueryClient is provided to app via `<QueryClientProvider>`

### Issue: Zod validation errors
**Solution**: Check API response structure matches schema definitions

### Issue: Image upload fails
**Solution**: Verify backend accepts multipart/form-data; check file size limits

---

## Resources

- [React Query Documentation](https://tanstack.com/query/latest)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [Fetch API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

---

**Last Updated**: 2026-05-31  
**Status**: Ready for Implementation
