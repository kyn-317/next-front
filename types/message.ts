export interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    subject: string;
    content: string;
    createdAt: string;
    isRead: boolean;
}

export interface SendMessageRequest {
    receiverId: string;
    subject: string;
    content: string;
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
} 