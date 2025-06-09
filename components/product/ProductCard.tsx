import { Product } from '@/types/product';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const [showImage, setShowImage] = useState(true);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkWidth = () => {
            if (cardRef.current) {
                setShowImage(cardRef.current.offsetWidth > 180);
            }
        };

        checkWidth();
        window.addEventListener('resize', checkWidth);

        return () => {
            window.removeEventListener('resize', checkWidth);
        };
    }, []);

    return (
        <Link href={`/products/${product._id}`}>
            <div ref={cardRef} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                {showImage && (
                    <div className="relative w-full" style={{ paddingTop: '75%' }}>
                        <Image
                            src={product.productImage || '/placeholder.png'}
                            alt={product.productName}
                            fill
                            className="object-cover"
                        />
                    </div>
                )}
                <div className="p-4 flex-grow flex flex-col">
                    <h2 className="text-lg font-semibold mb-2 line-clamp-2">{product.productName}</h2>
                    <p className="text-gray-600 mb-2 line-clamp-2 flex-grow">{product.productDescription}</p>
                    <p className="text-lg font-bold text-blue-600 mt-auto">
                        {product.productPrice ? product.productPrice.toLocaleString() : '0'}$
                    </p>
                </div>
            </div>
        </Link>
    );
} 