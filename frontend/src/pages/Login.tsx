import { useState } from 'react';
import { login } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await login(email, password);
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('email', email);
      navigate('/dashboard');
    } catch (e: any) {
      setError(e.response?.data?.detail || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-md shadow-xl">
        <h1 className="text-3xl font-bold text-white mb-2">ContextOS</h1>
        <p className="text-gray-400 mb-6">Welcome back</p>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <input
          className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 mb-4 outline-none"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 mb-6 outline-none"
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button
          className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-lg"
          onClick={handleLogin}
        >
          Login
        </button>
        <p className="text-gray-400 mt-4 text-center">
          Don't have an account?{' '}
          <Link to="/signup" className="text-violet-400 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}