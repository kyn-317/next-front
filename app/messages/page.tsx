'use client';

import { useState, useEffect } from 'react';
import { getInboxMessages, getSentMessages, markMessageAsRead } from '../../services/messageService';
import { Message } from '../../types/message';

export default function MessagesPage() {
    const [activeTab, setActiveTab] = useState<'inbox' | 'sent'>('inbox');
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchMessages();
    }, [activeTab, page]);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const response = activeTab === 'inbox' 
                ? await getInboxMessages(page, 10)
                : await getSentMessages(page, 10);
            setMessages(response.content);
            setTotalPages(response.totalPages);
        } catch (err) {
            setError('메시지를 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (messageId: string) => {
        try {
            await markMessageAsRead(messageId);
            // Update the message in the local state
            setMessages(messages.map((msg: Message) => 
                msg.id === messageId ? { ...msg, isRead: true } : msg
            ));
        } catch (err) {
            alert('메시지 읽음 처리 중 오류가 발생했습니다.');
        }
    };

    const resetPagination = () => {
        setPage(0);
    };

    if (loading) return <div className="p-8">로딩 중...</div>;
    if (error) return <div className="p-8 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">메시지</h1>
                <button
                    onClick={() => window.location.href = '/messages/compose'}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    메시지 작성
                </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-4 mb-6 border-b">
                <button
                    onClick={() => {
                        setActiveTab('inbox');
                        resetPagination();
                    }}
                    className={`pb-2 px-4 ${activeTab === 'inbox' 
                        ? 'border-b-2 border-blue-500 text-blue-500 font-semibold' 
                        : 'text-gray-600'}`}
                >
                    받은 메시지
                </button>
                <button
                    onClick={() => {
                        setActiveTab('sent');
                        resetPagination();
                    }}
                    className={`pb-2 px-4 ${activeTab === 'sent' 
                        ? 'border-b-2 border-blue-500 text-blue-500 font-semibold' 
                        : 'text-gray-600'}`}
                >
                    보낸 메시지
                </button>
            </div>

            {/* Messages List */}
            {messages.length === 0 ? (
                <p className="text-gray-500">메시지가 없습니다.</p>
            ) : (
                <div className="space-y-4">
                    {messages.map((message) => (
                        <div 
                            key={message.id} 
                            className={`border rounded-lg p-4 cursor-pointer hover:bg-gray-50 ${
                                !message.isRead && activeTab === 'inbox' ? 'bg-blue-50 border-blue-200' : ''
                            }`}
                            onClick={() => {
                                if (activeTab === 'inbox' && !message.isRead) {
                                    handleMarkAsRead(message.id);
                                }
                                window.location.href = `/messages/${message.id}`;
                            }}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                        <h3 className="text-lg font-semibold">{message.subject}</h3>
                                        {!message.isRead && activeTab === 'inbox' && (
                                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                                NEW
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-600 text-sm">
                                        {activeTab === 'inbox' ? `발신자: ${message.senderId}` : `수신자: ${message.receiverId}`}
                                    </p>
                                </div>
                                <div className="text-sm text-gray-500">
                                    {new Date(message.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                            <p className="text-gray-700 line-clamp-2">
                                {message.content}
                            </p>
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