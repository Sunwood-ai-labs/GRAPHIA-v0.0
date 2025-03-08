import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Settings, Edit2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Profile {
  username: string;
  email: string;
}

export function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  async function fetchProfile() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, email')
        .eq('id', user?.id)
        .single();

      if (error) throw error;

      setProfile(data);
      setUsername(data.username || data.email.split('@')[0]);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('プロフィールの取得に失敗しました。');
    } finally {
      setLoading(false);
    }
  }

  async function updateUsername() {
    if (!user || !username.trim()) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ username: username.trim() })
        .eq('id', user.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, username: username.trim() } : null);
      setIsEditing(false);
      setSuccess('ユーザー名を更新しました。');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating username:', err);
      setError('ユーザー名の更新に失敗しました。');
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center font-zen text-gray-600">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-8">
          <User className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-3xl font-kaisei text-dark">プロフィール</h1>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6 font-zen">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-500 p-4 rounded-md mb-6 font-zen">
            {success}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary bg-opacity-10 p-4 rounded-full">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="ユーザー名"
                    />
                    <button
                      onClick={updateUsername}
                      className="px-4 py-2 bg-primary hover:bg-secondary text-white rounded-md font-zen transition-colors"
                    >
                      保存
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setUsername(profile?.username || profile?.email.split('@')[0] || '');
                      }}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md font-zen transition-colors"
                    >
                      キャンセル
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-kaisei text-dark">
                      {profile?.username || profile?.email.split('@')[0]}
                    </h2>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-gray-500 hover:text-gray-700"
                      title="ユーザー名を編集"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
                <p className="text-sm font-zen text-gray-500">
                  メールアドレス: {profile?.email}
                </p>
                <p className="text-sm font-zen text-gray-500">
                  登録日: {user?.created_at ? new Date(user.created_at).toLocaleDateString('ja-JP') : '不明'}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 p-6">
            <div className="flex items-center mb-4">
              <Settings className="h-5 w-5 text-primary mr-2" />
              <h3 className="text-lg font-kaisei text-dark">アカウント設定</h3>
            </div>
            <div className="space-y-4">
              <button className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-50 font-zen text-gray-700 transition-colors">
                パスワードの変更
              </button>
              <button className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-50 font-zen text-gray-700 transition-colors">
                メール通知の設定
              </button>
              <button className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-50 font-zen text-warning transition-colors">
                アカウントの削除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}