export interface Product {
    _id: string;
    productName: string;
    productDescription: string;
    productPrice: number;
    productImage: string;
    productCategory: string;
    productSpecification: string;
    createdAt: string;
    updatedAt: string;
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
} 