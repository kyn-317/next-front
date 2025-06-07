'use client';

import { useState, useEffect } from 'react';
import { getCart, updateCartItem, removeFromCart, clearCart } from '../../services/cartService';
import { Cart } from '../../types/cart';

export default function CartPage() {
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const cartData = await getCart();
            setCart(cartData);
        } catch (err) {
            setError('장바구니를 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateQuantity = async (itemId: string, quantity: number) => {
        try {
            const updatedCart = await updateCartItem(itemId, { quantity });
            setCart(updatedCart);
        } catch (err) {
            alert('수량 변경 중 오류가 발생했습니다.');
        }
    };

    const handleRemoveItem = async (itemId: string) => {
        try {
            const updatedCart = await removeFromCart(itemId);
            setCart(updatedCart);
        } catch (err) {
            alert('상품 삭제 중 오류가 발생했습니다.');
        }
    };

    const handleClearCart = async () => {
        if (confirm('장바구니를 모두 비우시겠습니까?')) {
            try {
                await clearCart();
                setCart({ ...cart!, items: [], totalAmount: 0 });
            } catch (err) {
                alert('장바구니 초기화 중 오류가 발생했습니다.');
            }
        }
    };

    if (loading) return <div className="p-8">로딩 중...</div>;
    if (error) return <div className="p-8 text-red-500">{error}</div>;
    if (!cart || cart.items.length === 0) {
        return (
            <div className="container mx-auto p-8">
                <h1 className="text-3xl font-bold mb-8">장바구니</h1>
                <p className="text-gray-500">장바구니가 비어있습니다.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">장바구니</h1>
                <button
                    onClick={handleClearCart}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    전체 삭제
                </button>
            </div>

            <div className="space-y-4">
                {cart.items.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 flex justify-between items-center">
                        <div className="flex-1">
                            <h3 className="text-xl font-semibold">{item.productName}</h3>
                            <p className="text-gray-600">단가: ₩{item.price.toLocaleString()}</p>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                    className="bg-gray-300 text-gray-700 px-2 py-1 rounded"
                                >
                                    -
                                </button>
                                <span className="px-4">{item.quantity}</span>
                                <button
                                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                    className="bg-gray-300 text-gray-700 px-2 py-1 rounded"
                                >
                                    +
                                </button>
                            </div>
                            
                            <p className="text-xl font-bold">
                                ₩{(item.price * item.quantity).toLocaleString()}
                            </p>
                            
                            <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            >
                                삭제
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold">총 금액</span>
                    <span className="text-2xl font-bold text-blue-600">
                        ₩{cart.totalAmount.toLocaleString()}
                    </span>
                </div>
                
                <button
                    onClick={() => window.location.href = '/checkout'}
                    className="w-full bg-blue-500 text-white py-3 rounded-lg text-xl font-semibold hover:bg-blue-600"
                >
                    주문하기
                </button>
            </div>
        </div>
    );
} 