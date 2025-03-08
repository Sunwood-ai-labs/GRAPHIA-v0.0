import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserPlus } from 'lucide-react';

export function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signUp(email, password);
      navigate('/');
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.message.includes('already registered')) {
        setError('このメールアドレスは既に登録されています。');
      } else if (err.message.includes('password')) {
        setError('パスワードは8文字以上である必要があります。');
      } else if (err.message.includes('email')) {
        setError('有効なメールアドレスを入力してください。');
      } else {
        setError('登録に失敗しました。もう一度お試しください。');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <UserPlus className="h-8 w-8 text-primary mr-2" />
          <h1 className="text-2xl font-kaisei text-dark">アカウント登録</h1>
        </div>
        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6 text-sm font-zen">
            <p>{error}</p>
            {error.includes('既に登録されています') && (
              <button 
                onClick={() => navigate('/login')}
                className="text-primary hover:text-secondary block w-full mt-2 text-center"
              >
                ログインページへ
              </button>
            )}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-zen text-gray-700 mb-1">
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-zen text-gray-700 mb-1">
              パスワード
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
              minLength={8}
              disabled={loading}
            />
            <p className="mt-1 text-xs text-gray-500 font-zen">
              8文字以上で入力してください
            </p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-primary hover:bg-secondary text-white font-zen py-2 px-4 rounded-md transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? '登録中...' : '登録する'}
          </button>
        </form>
      </div>
    </div>
  );
}