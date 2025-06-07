'use client';

import { useEffect, useState, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { Product } from '@/types/product';
import { getProducts } from '@/services/productService';
import ProductCard from '../components/product/ProductCard';

export default function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const { ref, inView } = useInView({
        threshold: 0,
        rootMargin: '100px',
    });

    const fetchProducts = useCallback(async () => {
        if (loading || !hasMore) return;
        
        setLoading(true);
        try {
            const response = await getProducts(page, 10);
            if (response.content.length > 0) {
                setProducts(prev => [...prev, ...response.content]);
                setHasMore(page < response.totalPages - 1);
                setPage(prev => prev + 1);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    }, [page, loading, hasMore]);

    useEffect(() => {
        if (inView) {
            fetchProducts();
        }
    }, [inView, fetchProducts]);

    return (
        <main className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Hero Section */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Product Service에 오신 것을 환영합니다
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                    다양한 상품을 둘러보고, 장바구니에 담아 주문해보세요
                </p>
                
                {/* Quick Links */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                    <a href="/products" className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition-colors">
                        <div className="text-2xl mb-2">🛍️</div>
                        <div className="font-semibold">상품 보기</div>
                    </a>
                    <a href="/cart" className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 transition-colors">
                        <div className="text-2xl mb-2">🛒</div>
                        <div className="font-semibold">장바구니</div>
                    </a>
                    <a href="/orders" className="bg-purple-500 text-white p-4 rounded-lg hover:bg-purple-600 transition-colors">
                        <div className="text-2xl mb-2">📦</div>
                        <div className="font-semibold">주문내역</div>
                    </a>
                    <a href="/messages" className="bg-orange-500 text-white p-4 rounded-lg hover:bg-orange-600 transition-colors">
                        <div className="text-2xl mb-2">💬</div>
                        <div className="font-semibold">메시지</div>
                    </a>
                </div>
            </div>

            <h2 className="text-3xl font-bold mb-8">인기 상품</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
            <div ref={ref} className="h-20 flex items-center justify-center">
                {loading && <p>로딩 중...</p>}
                {!hasMore && <p>더 이상 상품이 없습니다.</p>}
            </div>
        </main>
    );
} 