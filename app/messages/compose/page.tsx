'use client';

import { useState } from 'react';
import { sendMessage } from '../../../services/messageService';
import { SendMessageRequest } from '../../../types/message';

export default function ComposeMessagePage() {
    const [formData, setFormData] = useState<SendMessageRequest>({
        receiverId: '',
        subject: '',
        content: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.receiverId || !formData.subject || !formData.content) {
            setError('모든 필드를 입력해주세요.');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            await sendMessage(formData);
            alert('메시지가 성공적으로 전송되었습니다.');
            window.location.href = '/messages';
        } catch (err) {
            setError('메시지 전송 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-8 max-w-2xl">
            <div className="flex items-center mb-8">
                <button
                    onClick={() => window.history.back()}
                    className="text-blue-500 hover:text-blue-700 mr-4"
                >
                    ← 뒤로가기
                </button>
                <h1 className="text-3xl font-bold">메시지 작성</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                <div>
                    <label htmlFor="receiverId" className="block text-sm font-medium text-gray-700 mb-2">
                        수신자 ID
                    </label>
                    <input
                        type="text"
                        id="receiverId"
                        name="receiverId"
                        value={formData.receiverId}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="수신자 ID를 입력해주세요"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        제목
                    </label>
                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="메시지 제목을 입력해주세요"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                        내용
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        rows={8}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="메시지 내용을 입력해주세요"
                        required
                    />
                </div>

                <div className="flex space-x-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-500 text-white py-3 rounded-md font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? '전송 중...' : '메시지 전송'}
                    </button>
                    <button
                        type="button"
                        onClick={() => window.location.href = '/messages'}
                        className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-md font-semibold hover:bg-gray-400"
                    >
                        취소
                    </button>
                </div>
            </form>
        </div>
    );
} 