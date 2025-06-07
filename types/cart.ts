export interface CartItem {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    price: number;
}

export interface Cart {
    id: string;
    userId: string;
    items: CartItem[];
    totalAmount: number;
}

export interface AddToCartRequest {
    productId: string;
    quantity: number;
}

export interface UpdateCartItemRequest {
    quantity: number;
} 