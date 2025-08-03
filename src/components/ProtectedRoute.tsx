import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresPayment?: boolean;
}

export function ProtectedRoute({ children, requiresPayment = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">Access Required</h2>
          <p className="text-gray-300 mb-6">
            You need to sign in to access this content.
          </p>
          <div className="space-y-3">
            <Link
              to="/login"
              className="block bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-3 px-6 rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-200"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="block bg-gray-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-700 transition-all duration-200"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (requiresPayment && user.subscription_status !== 'active') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">Payment Required</h2>
          <p className="text-gray-300 mb-6">
            You need to purchase the Veo3Factory pack to access this content.
          </p>
          <Link
            to="/checkout"
            className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-3 px-6 rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-200"
          >
            Purchase Now - $97
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}