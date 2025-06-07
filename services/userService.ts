interface User {
    name: string;
    email: string;
}

interface LoginRequest {
    email: string;
    password: string;
}

interface CreateUserRequest {
    userId: string; 
    userName: string;
    email: string;
    password: string;
}

class ApiError extends Error {
    response?: Response;
    status?: number;

    constructor(message: string, response?: Response) {
        super(message);
        this.response = response;
        this.status = response?.status;
    }
}

const API_URL = 'http://localhost:8070'; // Gateway URL

export const createUser = async (userData: CreateUserRequest): Promise<User> => {
    const response = await fetch(`${API_URL}/user/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        throw new ApiError('Failed to create user', response);
    }

    return response.json();
};

export const login = async (credentials: LoginRequest): Promise<string> => {
    const response = await fetch(`${API_URL}/user/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include',
    });

    if (!response.ok) {
        throw new ApiError('Failed to login', response);
    }

    const accessToken = await response.text();
    localStorage.setItem('accessToken', accessToken);
    return accessToken;
};

export const logout = async (): Promise<void> => {
    const response = await fetch(`${API_URL}/user/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    if (!response.ok) {
        throw new ApiError('Failed to logout', response);
    }

    localStorage.removeItem('accessToken');
};

export const checkLoginStatus = async (): Promise<User | null> => {
    try {
        const response = await fetch(`${API_URL}/user/isLogin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            return null;
        }

        const user = await response.json();
        return user;
    } catch (error) {
        return null;
    }
}; 