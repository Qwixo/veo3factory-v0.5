import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Download, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function SuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [guestCheckout, setGuestCheckout] = useState(false);

  useEffect(() => {
    // Refresh user data to get updated subscription status
    const refreshData = async () => {
      if (sessionId) {
        // Check if this was a guest checkout
        const isGuest = !user;
        setGuestCheckout(isGuest);
        
        // Wait a moment for webhook to process
        setTimeout(async () => {
          if (!isGuest) {
            await refreshUser();
          }
          setLoading(false);
        }, isGuest ? 5000 : 3000); // Wait longer for guest checkouts
      } else {
        setLoading(false);
      }
    };

    refreshData();
  }, [sessionId, refreshUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-white">Processing your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Yellow Cross */}
      <Link to="/" className="yellow-cross">
        <svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 0H14V10H24V14H14V32H10V14H0V10H10V0Z" fill="#FFD700"/>
        </svg>
      </Link>
      
      <div className="thank-you-container">
        <main className="thank-you-main">
          <div className="container">
            <div className="thank-you-card">
              {/* Success Icon */}
              <div className="success-icon">
                <CheckCircle className="w-20 h-20 text-green-400" />
              </div>
              
              {/* Thank You Message */}
              <h1 className="thank-you-title">Payment Successful!</h1>
              
              <div className="thank-you-content">
                <p className="main-message">
                  Welcome to <strong>Veo3Factory</strong>! Your automation system is ready to use.
                </p>
                
                {guestCheckout && (
                  <div className="bg-blue-900 border border-blue-600 rounded-lg p-4 mb-6">
                    <p className="text-blue-200">
                      <strong>Account Created:</strong> We've created an account for you. Check your email for login instructions.
                    </p>
                  </div>
                )}
                
                <p className="main-message">
                </p>
                
                <div className="bg-green-900 border border-green-600 rounded-lg p-4 mb-6">
                  <p className="text-green-200">
                    ✓ Your payment has been processed<br />
                    ✓ Access to the automation system<br />
                    ✓ Setup guides and resources available
                  </p>
                </div>
                
                <p className="contact-message">
                  You will receive an email with detailed setup instructions within the next few minutes. 
                  Please check your <strong>SPAM</strong> and <strong>PROMOTIONS</strong> folder just in case.
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-4">
                {user ? <Link
                  to="/dashboard"
                  className="back-home-button flex items-center justify-center space-x-2"
                >
                  <span>Access Your Dashboard</span>
                  <ArrowRight className="w-5 h-5" />
                </Link> : (
                  <Link
                    to="/login"
                    className="back-home-button flex items-center justify-center space-x-2"
                  >
                    <span>Sign In to Your Account</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button className="flex items-center justify-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors">
                    <Download className="w-5 h-5" />
                    <span>Download Files</span>
                  </button>
                  
                  <button className="flex items-center justify-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors">
                    <BookOpen className="w-5 h-5" />
                    <span>Setup Guide</span>
                  </button>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-900 border border-blue-600 rounded-lg">
                <p className="text-blue-200 text-sm">
                  <strong>Need help?</strong> Contact us at{' '}
                  <a href="mailto:support@veo3factory.com" className="text-blue-300 hover:text-blue-100 underline">
                    support@veo3factory.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="thank-you-footer">
          <div className="container">
            <p>&copy; 2025 Veo3Factory. All rights reserved.</p>
            <div className="footer-links">
              <a href="/privacy-policy.html">Privacy Policy</a>
              <a href="/cookie-policy.html">Cookie Policy</a>
              <a href="/legal-disclosure.html">Legal Disclosure</a>
              <a href="/terms-conditions.html">Terms & Conditions</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}