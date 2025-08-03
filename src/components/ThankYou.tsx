import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight, Home, Mail, Download } from 'lucide-react';

export function ThankYou() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold text-yellow-400 mb-4">
            Payment Successful!
          </h1>
          <p className="text-xl text-gray-300">
            Welcome to Veo3Factory! Your automation system is ready.
          </p>
        </div>

        <div className="bg-gray-900 border-2 border-yellow-400 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Purchase Complete</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-400">Product:</span>
              <span className="text-white font-bold">{product.name}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-400">Amount:</span>
              <span className="text-white font-bold">${product.price.toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-400">Status:</span>
              <span className="text-green-400 font-medium">Paid</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-400">Date:</span>
              <span className="text-white">
                {new Date().toLocaleDateString()}
              </span>
            </div>
            {sessionId && (
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-400">Session ID:</span>
                <span className="text-white text-sm font-mono">
                  {sessionId.slice(0, 20)}...
                </span>
              </div>
            )}
          </div>

          <div className="mt-6 p-4 bg-green-900 border border-green-500 rounded-lg">
            <h3 className="text-green-200 font-bold mb-2 flex items-center">
              <Download className="w-5 h-5 mr-2" />
              🎉 Access Granted!
            </h3>
            <p className="text-green-300">
              Your {product.name} automation system is now active! Check your email for download links and setup instructions.
            </p>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">What's Next?</h3>
          <div className="space-y-3 text-gray-300">
            <p className="flex items-start">
              <span className="text-yellow-400 mr-2">1.</span>
              Check your email for setup instructions and download links
            </p>
            <p className="flex items-start">
              <span className="text-yellow-400 mr-2">2.</span>
              Download your complete automation package
            </p>
            <p className="flex items-start">
              <span className="text-yellow-400 mr-2">3.</span>
              Follow the step-by-step setup guide
            </p>
            <p className="flex items-start">
              <span className="text-yellow-400 mr-2">4.</span>
              Start generating viral content in minutes!
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-3 px-6 rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all transform hover:scale-105"
          >
            <Home className="mr-2 w-5 h-5" />
            Back to Home
          </Link>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-400 flex items-center justify-center">
            <Mail className="w-4 h-4 mr-2" />
            Need help? Contact us at{' '}
            <a href="mailto:jan@veo3factory.com" className="text-yellow-400 hover:text-yellow-300 ml-1">
              jan@veo3factory.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}