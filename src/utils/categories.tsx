import type { ClientDishDto } from "@/types/dish";

export type CategoryOption = {
    value: string;
    label: string;
};

export function formatCategoryLabel(category: string): string {
    return category
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, letter => letter.toUpperCase());
}

export function getCategoriesFromDishes(dishes: ClientDishDto[]): CategoryOption[] {
    return [...new Set(dishes.map(dish => dish.category).filter((category): category is string => Boolean(category)))].map(category => ({
        value: category,
        label: formatCategoryLabel(category),
    }));
}
