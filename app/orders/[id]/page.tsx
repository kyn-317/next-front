'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Order } from '@/types/order';
import { getOrderById } from '@/services/orderService';

export default function OrderDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (id) {
            fetchOrder();
        }
    }, [id]);

    const fetchOrder = async () => {
        try {
            setLoading(true);
            const orderData = await getOrderById(id as string);
            setOrder(orderData);
        } catch (error) {
            console.error('Failed to fetch order:', error);
            setError('주문 정보를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'CONFIRMED':
                return 'bg-blue-100 text-blue-800';
            case 'SHIPPED':
                return 'bg-purple-100 text-purple-800';
            case 'DELIVERED':
                return 'bg-green-100 text-green-800';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'PENDING':
                return '주문 대기';
            case 'CONFIRMED':
                return '주문 확인';
            case 'SHIPPED':
                return '배송 중';
            case 'DELIVERED':
                return '배송 완료';
            case 'CANCELLED':
                return '주문 취소';
            default:
                return status;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">주문 정보를 불러오는 중...</div>
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

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">주문을 찾을 수 없습니다.</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-md p-8">
                    {/* Order Header */}
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">주문 상세</h1>
                            <p className="text-gray-600 mt-1">주문번호: {order.id}</p>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                        </span>
                    </div>

                    {/* Order Items */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">주문 상품</h2>
                        <div className="space-y-4">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                                    <div className="flex-1">
                                        <h3 className="font-medium">{item.productName || `상품 ${item.productId}`}</h3>
                                        <p className="text-gray-600">수량: {item.quantity}개</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">₩{(item.price * item.quantity).toLocaleString()}</p>
                                        <p className="text-sm text-gray-600">단가: ₩{item.price.toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="border-t pt-6 mb-8">
                        <div className="flex justify-between items-center text-xl font-bold">
                            <span>총 결제 금액</span>
                            <span className="text-blue-600">₩{order.totalAmount.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Order Info */}
                    <div className="border-t pt-6 mb-8">
                        <h2 className="text-xl font-semibold mb-4">주문 정보</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-600">주문일시</p>
                                <p className="font-medium">{new Date(order.createdAt).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">최종 수정일</p>
                                <p className="font-medium">{new Date(order.updatedAt).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-4">
                        <button
                            onClick={() => router.back()}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            뒤로 가기
                        </button>
                        {order.status === 'PENDING' && (
                            <button
                                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                onClick={() => {
                                    // Add cancel order functionality here
                                    alert('주문 취소 기능은 추후 구현예정입니다.');
                                }}
                            >
                                주문 취소
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 