export interface OrderItem {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    userId: string;
    items: OrderItem[];
    totalAmount: number;
    status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    createdAt: string;
    updatedAt: string;
}

export interface CreateOrderRequest {
    items: {
        productId: string;
        quantity: number;
    }[];
    totalAmount?: number;
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
} 