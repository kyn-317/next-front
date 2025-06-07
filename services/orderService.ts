import { Order, CreateOrderRequest, PageResponse } from '../types/order';

const API_URL = 'http://localhost:8070'; // Gateway URL

const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
    };
};

export const createOrder = async (request: CreateOrderRequest): Promise<Order> => {
    const response = await fetch(`${API_URL}/order/create`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error('Failed to create order');
    }

    return response.json();
};

export const getOrders = async (page: number, size: number): Promise<PageResponse<Order>> => {
    const response = await fetch(`${API_URL}/order?page=${page}&size=${size}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch orders');
    }

    return response.json();
};

export const getOrderById = async (orderId: string): Promise<Order> => {
    const response = await fetch(`${API_URL}/order/${orderId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch order');
    }

    return response.json();
};

export const cancelOrder = async (orderId: string): Promise<Order> => {
    const response = await fetch(`${API_URL}/order/${orderId}/cancel`, {
        method: 'PUT',
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error('Failed to cancel order');
    }

    return response.json();
}; 