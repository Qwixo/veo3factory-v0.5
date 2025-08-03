import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Zap, CheckCircle } from 'lucide-react';
import { STRIPE_CONFIG, getStripeProductConfig } from '../../stripe-config';
import { useAuth } from '../../contexts/AuthContext';
import { AuthModal } from '../auth/AuthModal';

const stripePromise = loadStripe(STRIPE_CONFIG.publishableKey);

export function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const { user } = useAuth();
  
  const product = getStripeProductConfig();

  useEffect(() => {
    // If user is already logged in and has active subscription, redirect to dashboard
    if (user?.subscription_status === 'active') {
      window.location.href = '/dashboard';
    }
  }, [user]);

  const handlePurchase = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          priceId: product.priceId,
          userId: user.id,
          userEmail: user.email,
        }),
      });

      const { sessionId, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // After successful auth, automatically trigger purchase
    setTimeout(() => {
      handlePurchase();
    }, 500);
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
                    <span>Veo3Factory</span>
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
                      You'll create an account during checkout
                    </p>
                  </div>
                )}

                {/* Checkout Button */}
                <button
                  onClick={handlePurchase}
                  disabled={loading}
                  className="checkout-button w-full"
                >
                  <span className="button-text">
                    {loading ? 'Processing...' : `COMPLETE PURCHASE - $${product.price / 100}`}
                  </span>
                  <span className="button-subtext">
                    {user ? 'Secure payment with Stripe' : 'Create account & pay'}
                  </span>
                </button>

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
            <p>&copy; 2025 Viral Reels Factory. All rights reserved.</p>
            <div className="footer-links">
              <a href="/privacy-policy.html">Privacy Policy</a>
              <a href="/cookie-policy.html">Cookie Policy</a>
              <a href="/legal-disclosure.html">Legal Disclosure</a>
              <a href="/terms-conditions.html">Terms & Conditions</a>
            </div>
          </div>
        </footer>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </div>
  );
}