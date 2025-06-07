'use client';

import { useState, useEffect } from 'react';
import { getOrders, cancelOrder } from '../../services/orderService';
import { Order } from '../../types/order';

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchOrders();
    }, [page]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await getOrders(page, 10);
            setOrders(response.content);
            setTotalPages(response.totalPages);
        } catch (err) {
            setError('주문 내역을 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (orderId: string) => {
        if (confirm('주문을 취소하시겠습니까?')) {
            try {
                await cancelOrder(orderId);
                fetchOrders(); // Refresh the orders list
            } catch (err) {
                alert('주문 취소 중 오류가 발생했습니다.');
            }
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'PENDING': return '대기중';
            case 'CONFIRMED': return '확인됨';
            case 'SHIPPED': return '배송중';
            case 'DELIVERED': return '배송완료';
            case 'CANCELLED': return '취소됨';
            default: return status;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'text-yellow-600';
            case 'CONFIRMED': return 'text-blue-600';
            case 'SHIPPED': return 'text-purple-600';
            case 'DELIVERED': return 'text-green-600';
            case 'CANCELLED': return 'text-red-600';
            default: return 'text-gray-600';
        }
    };

    if (loading) return <div className="p-8">로딩 중...</div>;
    if (error) return <div className="p-8 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">주문 내역</h1>
            
            {orders.length === 0 ? (
                <p className="text-gray-500">주문 내역이 없습니다.</p>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-6 shadow-md">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-semibold">주문 #{order.id}</h3>
                                    <p className="text-gray-600">
                                        주문일: {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className={`text-lg font-semibold ${getStatusColor(order.status)}`}>
                                        {getStatusText(order.status)}
                                    </span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h4 className="font-semibold mb-2">주문 상품</h4>
                                <div className="space-y-2">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex justify-between">
                                            <span>{item.productName} x {item.quantity}</span>
                                            <span>₩{(item.price * item.quantity).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t">
                                <span className="text-xl font-bold">
                                    총 금액: ₩{order.totalAmount.toLocaleString()}
                                </span>
                                <div className="space-x-2">
                                    <button
                                        onClick={() => window.location.href = `/orders/${order.id}`}
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    >
                                        상세보기
                                    </button>
                                    {order.status === 'PENDING' && (
                                        <button
                                            onClick={() => handleCancelOrder(order.id)}
                                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                        >
                                            주문취소
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

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