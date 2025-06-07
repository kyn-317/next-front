import { Message, SendMessageRequest, PageResponse } from '../types/message';

const API_URL = 'http://localhost:8070'; // Gateway URL

const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
    };
};

export const sendMessage = async (request: SendMessageRequest): Promise<Message> => {
    const response = await fetch(`${API_URL}/message/send`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error('Failed to send message');
    }

    return response.json();
};

export const getInboxMessages = async (page: number, size: number): Promise<PageResponse<Message>> => {
    const response = await fetch(`${API_URL}/message/inbox?page=${page}&size=${size}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch inbox messages');
    }

    return response.json();
};

export const getSentMessages = async (page: number, size: number): Promise<PageResponse<Message>> => {
    const response = await fetch(`${API_URL}/message/sent?page=${page}&size=${size}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch sent messages');
    }

    return response.json();
};

export const getMessageById = async (messageId: string): Promise<Message> => {
    const response = await fetch(`${API_URL}/message/${messageId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch message');
    }

    return response.json();
};

export const markMessageAsRead = async (messageId: string): Promise<Message> => {
    const response = await fetch(`${API_URL}/message/${messageId}/read`, {
        method: 'PUT',
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error('Failed to mark message as read');
    }

    return response.json();
}; 