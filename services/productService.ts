import { Product, PageResponse } from '../types/product';

const API_URL = 'http://localhost:8081';

export const getProducts = async (page: number, size: number): Promise<PageResponse<Product>> => {
    const response = await fetch(`${API_URL}/findProductPaging?page=${page}&size=${size}`);
    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }
    return response.json();
};

export const getProductById = async (id: string): Promise<Product> => {
    const response = await fetch(`${API_URL}/findProductById/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch product');
    }
    return response.json();
}; 