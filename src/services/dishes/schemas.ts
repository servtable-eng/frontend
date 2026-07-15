import { z } from "zod"; 

export const DishSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "O nome do prato é obrigatório."),
  description: z.string().optional().nullable(),
  ingredients: z.string().optional().nullable(),
  category: z.string().min(1, "A categoria é obrigatória."),
  price: z.number().positive("O preço deve ser maior que zero."),
  buffetPosition: z.number().int().positive("A posição deve ser um número inteiro positivo."),
  available: z.boolean(),
  imageUrl: z.string().url().optional().nullable(),
});

export const CreateDishInputSchema = z.object({
  name: z.string().min(1, "O nome do prato é obrigatório."),
  description: z.string().optional().nullable(),
  ingredients: z.string().optional().nullable(),
  category: z.string().min(1, "A categoria é obrigatória."),
  price: z.number().positive("O preço deve ser maior que zero."),
  buffetPosition: z.number().int().positive("A posição deve ser um número inteiro positivo."),
  available: z.boolean().optional().default(true),
  imageUrl: z.string().url().optional().nullable(),
});

export const UpdateDishInputSchema = CreateDishInputSchema.extend({
  id: z.number(),
});

export const DishListResponseSchema = z.array(DishSchema);

export type Dish = z.infer<typeof DishSchema>;
export type CreateDishInput = z.infer<typeof CreateDishInputSchema>;
export type UpdateDishInput = z.infer<typeof UpdateDishInputSchema>;
export type DishListResponse = z.infer<typeof DishListResponseSchema>;
