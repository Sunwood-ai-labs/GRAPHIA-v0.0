import React from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, Upload, GalleryVertical as Gallery, User, LogOut } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';

export function Layout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-12xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center">
                <Home className="h-6 w-6 text-primary" />
                <span className="ml-2 font-kaisei text-lg text-dark">GRAPHIA</span>
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/gallery"
                  className="inline-flex items-center px-1 pt-1 text-sm font-zen text-dark hover:text-accent"
                >
                  <Gallery className="h-4 w-4 mr-1" />
                  作品一覧
                </Link>
                {user && (
                  <Link
                    to="/upload"
                    className="inline-flex items-center px-1 pt-1 text-sm font-zen text-dark hover:text-accent"
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    作品投稿
                  </Link>
                )}
                <Link
                  to="/rankings"
                  className="inline-flex items-center px-1 pt-1 text-sm font-zen text-dark hover:text-accent"
                >
                  <FontAwesomeIcon icon={faTrophy} className="h-4 w-4 mr-1" />
                  ランキング
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/profile"
                    className="inline-flex items-center text-sm font-zen text-dark hover:text-accent"
                  >
                    <User className="h-4 w-4 mr-1" />
                    プロフィール
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="inline-flex items-center text-sm font-zen text-warning hover:text-accent"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    ログアウト
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-zen text-white bg-primary hover:bg-secondary"
                  >
                    ログイン
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-zen text-white bg-accent hover:bg-warning"
                  >
                    登録
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-12xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}