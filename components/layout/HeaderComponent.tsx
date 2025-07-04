'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { checkLoginStatus, logout } from '@/services/userService';

interface User {
    name: string;
    email: string;
}

export default function HeaderComponent() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const userData = await checkLoginStatus();
                if (userData) {
                    setUser(userData);
                    setIsLoggedIn(true);
                } else {
                    setUser(null);
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error('Failed to check login status:', error);
                setUser(null);
                setIsLoggedIn(false);
            }
        };
        checkStatus();
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            setIsLoggedIn(false);
            setUser(null);
            router.push('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <header className="bg-white border-b border-gray-200">
            <div className="container mx-auto max-w-7xl px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0">
                        <h1 className="text-2xl font-bold text-blue-600">Product Service</h1>
                    </Link>

                    {/* Navigation Links */}
                    <nav className="hidden md:flex space-x-6">
                        <Link href="/products" className="text-gray-600 hover:text-gray-900">
                            상품
                        </Link>
                        {isLoggedIn && (
                            <>
                                <Link href="/cart" className="text-gray-600 hover:text-gray-900">
                                    장바구니
                                </Link>
                                <Link href="/orders" className="text-gray-600 hover:text-gray-900">
                                    주문내역
                                </Link>
                                <Link href="/messages" className="text-gray-600 hover:text-gray-900">
                                    메시지
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* Right Section */}
                    <div className="flex items-center space-x-4">
                        {/* User Section */}
                        <div className="flex items-center space-x-2">
                            {isLoggedIn ? (
                                <>
                                    <span className="text-gray-700">{user?.name}</span>
                                    <button
                                        onClick={handleLogout}
                                        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
                                    >
                                        로그아웃
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
                                >
                                    로그인
                                </Link>
                            )}
                        </div>

                        {/* Cart */}
                        <Link
                            href="/cart"
                            className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                            <span className="text-sm">장바구니</span>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}