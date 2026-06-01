import { useState } from 'react';
import { signup } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await signup(email, password);
      navigate('/login');
    } catch (e: any) {
      setError(e.response?.data?.detail || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-md shadow-xl">
        <h1 className="text-3xl font-bold text-white mb-2">ContextOS</h1>
        <p className="text-gray-400 mb-6">Create your account</p>
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
          onClick={handleSignup}
        >
          Sign Up
        </button>
        <p className="text-gray-400 mt-4 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-violet-400 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}