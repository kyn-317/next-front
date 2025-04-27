import { ReactNode } from 'react';
import HeaderComponent from './HeaderComponent';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <HeaderComponent />
            <main className="flex-grow">
                {children}
            </main>
        </div>
    );
} 