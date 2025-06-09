'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import { getProductById } from '@/services/productService';
import { addToCart } from '@/services/cartService';
import { createOrder } from '@/services/orderService';
import { AddToCartRequest } from '@/types/cart';
import { CreateOrderRequest } from '@/types/order';

export default function ProductDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isPurchasing, setIsPurchasing] = useState(false);

    useEffect(() => {
        if (id) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const productData = await getProductById(id as string);
            setProduct(productData);
        } catch (error) {
            console.error('Failed to fetch product:', error);
            setError('상품을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!product) return;
        
        try {
            setIsAddingToCart(true);
            const addToCartRequest: AddToCartRequest = {
                cartItems: [{
                    productId: product._id,
                    quantity: quantity,
                }],
            };
            
            await addToCart(addToCartRequest);
            alert('장바구니에 추가되었습니다!');
        } catch (error) {
            console.error('Failed to add to cart:', error);
            if (error instanceof Error) {
                alert(`장바구니 추가에 실패했습니다: ${error.message}`);
            } else {
                alert('장바구니 추가에 실패했습니다.');
            }
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handlePurchase = async () => {
        if (!product) return;
        
        try {
            setIsPurchasing(true);
            const orderRequest: CreateOrderRequest = {
                items: [{
                    productId: product._id,
                    quantity: quantity,
                }],
                totalAmount: product.productPrice * quantity,
            };
            
            const order = await createOrder(orderRequest);
            alert('주문이 완료되었습니다!');
            router.push(`/orders/${order.id}`);
        } catch (error) {
            console.error('Failed to create order:', error);
            alert('주문에 실패했습니다. 로그인이 필요할 수 있습니다.');
        } finally {
            setIsPurchasing(false);
        }
    };

    const incrementQuantity = () => {
        setQuantity(prev => prev + 1);
    };

    const decrementQuantity = () => {
        setQuantity(prev => prev > 1 ? prev - 1 : 1);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">상품 정보를 불러오는 중...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-red-600">{error}</div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">상품을 찾을 수 없습니다.</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="md:flex">
                        {/* Product Image */}
                        <div className="md:w-1/2">
                            <img
                                src={product.productImage || '/placeholder-image.jpg'}
                                alt={product.productName}
                                className="w-full h-96 md:h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = '/placeholder-image.jpg';
                                }}
                            />
                        </div>
                        
                        {/* Product Info */}
                        <div className="md:w-1/2 p-8">
                            <div className="mb-4">
                                <span className="text-sm text-gray-500 uppercase tracking-wide">
                                    {product.productCategory}
                                </span>
                                <h1 className="text-3xl font-bold text-gray-900 mt-2">
                                    {product.productName}
                                </h1>
                            </div>
                            
                            <div className="mb-6">
                                <p className="text-3xl font-bold text-blue-600">
                                    ₩{product.productPrice.toLocaleString()}
                                </p>
                            </div>
                            
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">상품 설명</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    {product.productDescription}
                                </p>
                            </div>
                            
                            {product.productSpecification && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">상품 사양</h3>
                                    <p className="text-gray-700">
                                        {product.productSpecification}
                                    </p>
                                </div>
                            )}
                            
                            {/* Quantity Selector */}
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">수량</h3>
                                <div className="flex items-center border rounded-md w-32">
                                    <button
                                        onClick={decrementQuantity}
                                        className="px-3 py-2 text-gray-600 hover:text-gray-800"
                                    >
                                        -
                                    </button>
                                    <span className="px-4 py-2 text-center bg-gray-50 min-w-[50px]">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={incrementQuantity}
                                        className="px-3 py-2 text-gray-600 hover:text-gray-800"
                                    >
                                        +
                                    </button>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                    총 금액: ₩{(product.productPrice * quantity).toLocaleString()}
                                </p>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex space-x-4">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={isAddingToCart}
                                    className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-md font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isAddingToCart ? '추가 중...' : '장바구니 담기'}
                                </button>
                                <button
                                    onClick={handlePurchase}
                                    disabled={isPurchasing}
                                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isPurchasing ? '주문 중...' : '바로 구매'}
                                </button>
                            </div>
                            
                            <div className="mt-6 text-sm text-gray-500">
                                <p>등록일: {new Date(product.createdAt).toLocaleDateString()}</p>
                                <p>수정일: {new Date(product.updatedAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Back Button */}
                <div className="mt-6">
                    <button
                        onClick={() => router.back()}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                        ← 상품 목록으로 돌아가기
                    </button>
                </div>
            </div>
        </div>
    );
} 