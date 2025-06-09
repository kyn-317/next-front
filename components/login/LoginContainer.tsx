'use client';

import { useRouter } from 'next/navigation';
import LoginForm from './LoginForm';

export default function LoginContainer() {
  const router = useRouter();

  const handleLogin = async (id: string, password: string) => {    
    try {
      const response = await fetch('http://localhost:8070/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: id, password: password }),
        credentials: 'include',
      });

      if (response.ok) {
        const tokenData = await response.json();
        if(tokenData.accessToken){
          localStorage.setItem('accessToken', tokenData.accessToken);
          router.push('/'); 
        }else{
          alert('Login Failed: No access token received');
        }
      } else {
        alert('Login Failed');
      }
    } catch (error) {
      console.error('Login Failed:', error);
      alert('Login Failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <LoginForm onSubmit={handleLogin} />
      </div>
    </div>
  );
} 