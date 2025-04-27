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
            <h1 className="text-3xl font-bold mb-8">상품 목록</h1>
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