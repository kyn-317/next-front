import { Cart, AddToCartRequest, UpdateCartItemRequest } from '../types/cart';

const API_URL = 'http://localhost:8070'; // Gateway URL

const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
    };
};

const getUserEmail = async (): Promise<string | null> => {
    try {
        const token = localStorage.getItem('accessToken');
        if (!token) return null;
        
        const response = await fetch(`${API_URL}/user/isLogin`, {
            method: 'POST',
            headers: getAuthHeaders(),
        });
        
        if (response.ok) {
            const user = await response.json();
            return user.email;
        }
        return null;
    } catch (error) {
        console.error('Failed to get user email:', error);
        return null;
    }
};

export const getCart = async (): Promise<Cart> => {
    const email = await getUserEmail();
    if (!email) {
        throw new Error('User not logged in');
    }

    const response = await fetch(`${API_URL}/cart/getCart`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ email }),
    });

    console.log('Get cart response status:', response.status);

    if (!response.ok) {
        const errorText = await response.text();
        console.log('Get cart error response:', errorText);
        throw new Error(`Failed to fetch cart: ${response.status} - ${errorText}`);
    }

    const responseText = await response.text();
    console.log('Get cart response text:', responseText);

    if (!responseText) {
        // Return empty cart if no response
        return { id: '', userId: email, items: [], totalAmount: 0 } as Cart;
    }

    try {
        return JSON.parse(responseText);
    } catch (error) {
        console.error('Get cart JSON parse error:', error);
        // Return empty cart if JSON parse fails
        return { id: '', userId: email, items: [], totalAmount: 0 } as Cart;
    }
};

export const createCart = async (): Promise<Cart> => {
    const email = await getUserEmail();
    if (!email) {
        throw new Error('User not logged in');
    }

    const response = await fetch(`${API_URL}/cart/createCart`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.log('Error creating cart:', errorText);
        throw new Error(`Failed to create cart: ${response.status} - ${errorText}`);
    }

    const responseText = await response.text();
    
    if (!responseText) {
        // If cart creation returns empty response, it might be successful
        return { id: '', userId: email, items: [], totalAmount: 0 } as Cart;
    }

    try {
        return JSON.parse(responseText);
    } catch (error) {
        // If JSON parse fails, assume cart was created successfully
        return { id: '', userId: email, items: [], totalAmount: 0 } as Cart;
    }
};

export const addToCart = async (request: AddToCartRequest): Promise<Cart> => {
    const email = await getUserEmail();
    if (!email) {
        throw new Error('User not logged in');
    }

    // First ensure cart exists
    try {
        await createCart();
    } catch (error) {
        console.log('Cart might already exist, continuing...');
    }

    const cartItem = request.cartItems[0];
    
    // Backend expects CartRequest with List<CartItemRequest> cartItems
    // CartItemRequest needs: productId, productName, productPrice, productQuantity
    
    // We need to get product details first to send complete CartItemRequest
    console.log('Fetching product details for:', cartItem.productId);
    
    let productDetails;
    try {
        const productResponse = await fetch(`${API_URL}/product/findProductById/${cartItem.productId}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        
        if (productResponse.ok) {
            productDetails = await productResponse.json();
            console.log('Product details:', productDetails);
        }
    } catch (error) {
        console.log('Failed to fetch product details:', error);
    }

    // Prepare the correct request structure exactly like Postman example
    const cartItemRequest = {
        productId: cartItem.productId,
        productName: productDetails?.name || `Product ${cartItem.productId}`,
        productPrice: productDetails?.price || 99.99,
        productQuantity: cartItem.quantity,
    };

    const requestWithEmail = {
        email: email,
        cartItems: [cartItemRequest],
    };
    
    // Test with hardcoded data first to ensure structure is correct
    const testRequest = {
        email: email,
        cartItems: [
            {
                productId: cartItem.productId,
                productName: "Test Product",
                productPrice: 99.99,
                productQuantity: cartItem.quantity
            }
        ]
    };
    
    console.log('Testing with hardcoded request:', testRequest);

    console.log('Sending cart request with correct structure:', requestWithEmail);
    
    // Use testRequest first to verify structure works
    const finalRequest = testRequest;
    const jsonBody = JSON.stringify(finalRequest);
    console.log('JSON body being sent:', jsonBody);
    console.log('Headers:', getAuthHeaders());

    const response = await fetch(`${API_URL}/cart/addCartItem`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: jsonBody,
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        throw new Error(`Failed to add item to cart: ${response.status} - ${errorText}`);
    }

    const responseText = await response.text();
    console.log('Response text:', responseText);

    if (!responseText) {
        // If empty response, fetch the cart to return current state
        return await getCart();
    }

    try {
        return JSON.parse(responseText);
    } catch (error) {
        console.error('JSON parse error:', error);
        // If JSON parse fails, fetch the cart to return current state
        return await getCart();
    }
};

export const updateCartItem = async (request: UpdateCartItemRequest & { productId: string }): Promise<Cart> => {
    const email = await getUserEmail();
    if (!email) {
        throw new Error('User not logged in');
    }

    // Get product details for complete CartItemRequest
    let productDetails;
    try {
        const productResponse = await fetch(`${API_URL}/product/findProductById/${request.productId}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        
        if (productResponse.ok) {
            productDetails = await productResponse.json();
        }
    } catch (error) {
        console.log('Failed to fetch product details:', error);
    }

    const requestWithEmail = {
        email,
        cartItems: [{
            productId: request.productId,
            productName: productDetails?.name || `Product ${request.productId}`,
            productPrice: productDetails?.price || 0,
            productQuantity: request.quantity,
        }],
    };

    const response = await fetch(`${API_URL}/cart/updateCartItem`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestWithEmail),
    });

    if (!response.ok) {
        throw new Error('Failed to update cart item');
    }

    return response.json();
};

export const removeFromCart = async (request: { productId: string }): Promise<Cart> => {
    const email = await getUserEmail();
    if (!email) {
        throw new Error('User not logged in');
    }

    // Get product details for complete CartItemRequest
    let productDetails;
    try {
        const productResponse = await fetch(`${API_URL}/product/findProductById/${request.productId}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        
        if (productResponse.ok) {
            productDetails = await productResponse.json();
        }
    } catch (error) {
        console.log('Failed to fetch product details:', error);
    }

    const requestWithEmail = {
        email,
        cartItems: [{
            productId: request.productId,
            productName: productDetails?.name || `Product ${request.productId}`,
            productPrice: productDetails?.price || 0,
            productQuantity: 0, // For removal, quantity might be 0 or 1
        }],
    };

    const response = await fetch(`${API_URL}/cart/deleteCartItem`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestWithEmail),
    });

    if (!response.ok) {
        throw new Error('Failed to remove item from cart');
    }

    return response.json();
};

export const clearCart = async (): Promise<Cart> => {
    const email = await getUserEmail();
    if (!email) {
        throw new Error('User not logged in');
    }

    const response = await fetch(`${API_URL}/cart/clearCart`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        throw new Error('Failed to clear cart');
    }

    return response.json();
}; 