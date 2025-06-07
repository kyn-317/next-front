import { Cart, AddToCartRequest, UpdateCartItemRequest } from '../types/cart';

const API_URL = 'http://localhost:8070'; // Gateway URL

const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
    };
};

export const getCart = async (): Promise<Cart> => {
    const response = await fetch(`${API_URL}/cart`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch cart');
    }

    return response.json();
};

export const addToCart = async (request: AddToCartRequest): Promise<Cart> => {
    const response = await fetch(`${API_URL}/cart/add`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error('Failed to add item to cart');
    }

    return response.json();
};

export const updateCartItem = async (itemId: string, request: UpdateCartItemRequest): Promise<Cart> => {
    const response = await fetch(`${API_URL}/cart/items/${itemId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error('Failed to update cart item');
    }

    return response.json();
};

export const removeFromCart = async (itemId: string): Promise<Cart> => {
    const response = await fetch(`${API_URL}/cart/items/${itemId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error('Failed to remove item from cart');
    }

    return response.json();
};

export const clearCart = async (): Promise<void> => {
    const response = await fetch(`${API_URL}/cart/clear`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error('Failed to clear cart');
    }
}; 