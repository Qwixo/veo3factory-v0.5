import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Zap, CheckCircle, Mail, Lock } from 'lucide-react';
import { STRIPE_CONFIG, getStripeProductConfig } from '../../stripe-config';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showAccountForm, setShowAccountForm] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const product = getStripeProductConfig();

  useEffect(() => {
    // If user is already logged in and has active subscription, redirect to dashboard
    if (user?.subscription_status === 'active') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const createAccountAndPurchase = async () => {
    setLoading(true);
    setError('');

    // Validate form if creating new account
    if (!user && showAccountForm) {
      if (!email || !password || !confirmPassword) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }
      
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }
      
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }
    }

    try {
      let session;
      
      if (!user && showAccountForm) {
        // Create new account
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: undefined // Disable email confirmation
          }
        });
        
        if (signUpError) {
          setError(signUpError.message);
          setLoading(false);
          return;
        }
        
        session = data.session;
      } else if (user) {
        // Use existing session
        const { data } = await supabase.auth.getSession();
        session = data.session;
      } else {
        // Guest checkout - no session needed
        session = null;
      }

      // Prepare checkout data
      const checkoutData = {
        price_id: product.priceId,
        success_url: `${window.location.origin}/success`,
        cancel_url: `${window.location.origin}/checkout`,
        mode: product.mode,
      };

      // Add customer email for guest checkout
      if (!session && email) {
        checkoutData.customer_email = email;
      }

      const headers = {
        'Content-Type': 'application/json',
      };
      
      // Add authorization header if we have a session
      if (session) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers,
        body: JSON.stringify(checkoutData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      setError(error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = () => {
    if (user) {
      // User is already logged in, proceed directly
      createAccountAndPurchase();
    } else {
      // Show account creation form
      setShowAccountForm(true);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Yellow Cross */}
      <Link to="/" className="yellow-cross">
        <svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 0H14V10H24V14H14V32H10V14H0V10H10V0Z" fill="#FFD700"/>
        </svg>
      </Link>
      
      <div className="checkout-container">
        {/* Header */}
        <header className="checkout-header">
          <div className="container">
            <h1 className="checkout-title">Fully Automated Social Media Pack</h1>
          </div>
        </header>

        {/* Main Checkout Content */}
        <main className="checkout-main">
          <div className="container">
            <div className="checkout-grid">
              <div className="features-card">
                <div className="product-header">
                  <h2>WHAT YOU GET</h2>
                </div>

                <div className="product-features">
                  <ul className="features-list">
                    <li><CheckCircle className="inline w-5 h-5 mr-2 text-green-400" />Complete n8n Automation Workflow</li>
                    <li><CheckCircle className="inline w-5 h-5 mr-2 text-green-400" />VEO 3 AI Video Generation Setup</li>
                    <li><CheckCircle className="inline w-5 h-5 mr-2 text-green-400" />GROK & GPT Integration</li>
                    <li><CheckCircle className="inline w-5 h-5 mr-2 text-green-400" />Auto-posting to 3 Platforms</li>
                    <li><CheckCircle className="inline w-5 h-5 mr-2 text-green-400" />ASMR Video Templates</li>
                    <li><CheckCircle className="inline w-5 h-5 mr-2 text-green-400" />Postiz Social Media Scheduler</li>
                    <li><CheckCircle className="inline w-5 h-5 mr-2 text-green-400" />Complete Setup Guide</li>
                    <li><CheckCircle className="inline w-5 h-5 mr-2 text-green-400" />24/7 Automation (Posts Every 8 Hours)</li>
                    <li><CheckCircle className="inline w-5 h-5 mr-2 text-green-400" />Access to Expert Automators & Support</li>
                  </ul>
                </div>

                <div className="product-image">
                  <div className="automation-visual">
                    <div className="workflow-icon">🤖</div>
                    <div className="arrow">→</div>
                    <div className="platforms">
                      <span className="platform">📱 TikTok</span>
                      <span className="platform">📸 Instagram</span>
                      <span className="platform">🎥 YouTube</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pricing-card">
                <div className="pricing-breakdown">
                  <div className="price-row">
                    <span>{product.name}</span>
                    <span className="original-price">$650</span>
                  </div>
                  <div className="price-row discount">
                    <span>First 100 Members Discount</span>
                    <span className="discount-amount">-$553</span>
                  </div>
                  <div className="price-row total">
                    <span>Your Price Today</span>
                    <span className="final-price">${product.price / 100}</span>
                  </div>
                </div>

                <div className="urgency-timer">
                  <div className="order-limit">
                    <div className="limit-label">⚠️ Limited Availability:</div>
                    <div className="limit-counter">
                      <span className="orders-left">29/100</span>
                      <span className="limit-text">orders left at this price</span>
                    </div>
                  </div>
                </div>

                {/* Auth Status */}
                {user ? (
                  <div className="mb-4 p-3 bg-green-900 border border-green-600 rounded-lg">
                    <p className="text-green-200 text-sm">
                      ✓ Signed in as {user.email}
                    </p>
                  </div>
                ) : (
                  <div className="mb-4 p-3 bg-blue-900 border border-blue-600 rounded-lg">
                    <p className="text-blue-200 text-sm">
                      You'll need to create an account to purchase
                    </p>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-3 bg-red-900 border border-red-600 rounded-lg">
                    <p className="text-red-200 text-sm">{error}</p>
                  </div>
                )}

                {/* Account Creation Form */}
                {!user && showAccountForm && (
                  <div className="mb-6 p-4 bg-gray-800 border border-gray-600 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-4">Create Your Account</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                            placeholder="Enter your email"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                            placeholder="Enter your password"
                            required
                            minLength={6}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                            placeholder="Confirm your password"
                            required
                            minLength={6}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Checkout Button */}
                <button
                  onClick={handlePurchase}
                  disabled={loading}
                  className="checkout-button w-full"
                >
                  <span className="button-text">
                    {loading ? 'Processing...' : showAccountForm && !user ? 'CREATE ACCOUNT & PAY' : `COMPLETE PURCHASE - $${product.price / 100}`}
                  </span>
                  <span className="button-subtext">
                    {user ? 'Secure payment with Stripe' : 'Create account & pay'}
                  </span>
                </button>

                {/* Auth Links */}
                {!user && !showAccountForm && (
                  <div className="text-center mb-4">
                    <p className="text-gray-400 text-sm mb-2">
                      Already have an account?{' '}
                      <Link to="/login" className="text-yellow-400 hover:text-yellow-300">
                        Sign in first
                      </Link>
                    </p>
                  </div>
                )}
                {!user && (
                  <div className="text-center mb-4">
                    <p className="text-gray-400 text-sm mb-2">
                      Already have an account?{' '}
                      <Link to="/login" className="text-yellow-400 hover:text-yellow-300">
                        Sign in
                      </Link>
                    </p>
                  </div>
                )}

                {/* Trust Signals */}
                <div className="trust-signals">
                  <div className="trust-item">
                    <Shield className="w-5 h-5 text-green-400" />
                    <span>256-bit SSL encryption</span>
                  </div>
                  <div className="trust-item">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <span>Instant digital delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="checkout-footer">
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