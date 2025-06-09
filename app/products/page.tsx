'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProducts } from '../../services/productService';
import { Product } from '../../types/product';

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchProducts();
    }, [page]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await getProducts(page, 10);
            setProducts(response.content);
            setTotalPages(response.totalPages);
        } catch (err) {
            setError('상품을 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8">로딩 중...</div>;
    if (error) return <div className="p-8 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">상품 목록</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div key={product._id} className="border rounded-lg p-4 shadow-md">
                        <img
                            src={product.productImage || '/placeholder-image.jpg'}
                            alt={product.productName}
                            className="w-full h-48 object-cover mb-4 rounded"
                            onError={(e) => {
                                e.currentTarget.src = '/placeholder-image.jpg';
                            }}
                        />
                        <h3 className="text-xl font-semibold mb-2">{product.productName}</h3>
                        <p className="text-gray-600 mb-2 line-clamp-2">{product.productDescription}</p>
                        <p className="text-2xl font-bold text-blue-600 mb-2">
                            ₩{product.productPrice.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                            카테고리: {product.productCategory}
                        </p>
                        <div className="flex space-x-2">
                            <Link 
                                href={`/products/${product._id}`}
                                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors text-center"
                            >
                                상세보기
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8 space-x-2">
                <button
                    onClick={() => setPage(Math.max(0, page - 1))}
                    disabled={page === 0}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
                >
                    이전
                </button>
                <span className="px-4 py-2">
                    {page + 1} / {totalPages}
                </span>
                <button
                    onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                    disabled={page >= totalPages - 1}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
                >
                    다음
                </button>
            </div>
        </div>
    );
} 