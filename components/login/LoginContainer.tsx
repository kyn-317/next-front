'use client';

import { useRouter } from 'next/navigation';
import LoginForm from './LoginForm';

export default function LoginContainer() {
  const router = useRouter();

  const handleLogin = async (id: string, password: string) => {    
    try {
      const response = await fetch('http://localhost:8080/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail: id, userPassword:password }),
      });

      if (response.ok) {
        const data = await response.json();
        if(data.status === "OK"){
          localStorage.setItem('jwt', data);
          router.push('/'); 
        }else{
          alert('login Failed');
        }
      } else {
        alert('login Failed');
      }
    } catch (error) {
      console.error('login Failed:', error);
      alert('login Failed');
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