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
    const response = await fetch(`${API_URL}/order/byCart`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error('Failed to create order');
    }

    return response.json();
};

// Note: This endpoint is not available in the current backend
export const getOrders = async (page: number, size: number): Promise<PageResponse<Order>> => {
    const response = await fetch(`${API_URL}/order/purchase-order`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch orders');
    }

    const orders = await response.json();
    // Transform the response to match the expected PageResponse format
    return {
        content: orders,
        totalElements: orders.length,
        totalPages: 1,
        size: size,
        number: page,
    };
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

// Note: This endpoint is not available in the current backend
export const cancelOrder = async (orderId: string): Promise<Order> => {
    // This functionality is not implemented in the current backend
    throw new Error('Order cancellation is not currently supported');
}; 