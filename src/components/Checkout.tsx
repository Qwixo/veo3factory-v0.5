import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Shield, Zap } from 'lucide-react';
import { createCheckoutSession } from '../../lib/stripe';
import { getMainProduct } from '../../stripe-config';

export function Checkout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const veo3Product = getMainProduct();

  const handleCheckout = async () => {
    setLoading(true);
    setError('');

    try {
      const { url } = await createCheckoutSession({
        priceId: veo3Product.priceId,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: window.location.href,
        mode: veo3Product.mode,
      });

      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to process checkout. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/" className="inline-flex items-center text-yellow-400 hover:text-yellow-300 transition-colors mb-8">
          <ArrowLeft size={20} className="mr-2" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-yellow-400 mb-4">Complete Your Purchase</h1>
          <p className="text-xl text-gray-300">Get instant access to the Veo3Factory social media automation system</p>
        </div>

        {error && (
          <div className="bg-red-900 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-8 max-w-2xl mx-auto">
            {error}
          </div>
        )}

        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-900 border-2 border-yellow-400 rounded-2xl p-8">
            
            {/* Price Card */}
            <div className="bg-gray-800 rounded-xl p-6 mb-8 text-center">
              <h2 className="text-3xl font-bold text-yellow-400 mb-2">Veo3Factory</h2>
              <p className="text-gray-400 mb-4">{veo3Product.description}</p>

              <div className="text-gray-500 text-lg line-through mb-1">$650</div>
              <div className="text-green-400 text-sm mb-1">–$553 (First 100 Members Discount)</div>
              <div className="text-5xl font-bold text-yellow-400 mb-2">${veo3Product.price.toFixed(2)}</div>
              <p className="text-gray-400">One-time payment</p>

              {/* Scarcity */}
              <p className="text-red-400 font-semibold mt-4">⚠️ Only 29/100 spots left at this price</p>
            </div>

            {/* Features */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center text-gray-300">
                <Shield className="w-5 h-5 text-green-400 mr-3" />
                <span>256-bit SSL encryption</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Zap className="w-5 h-5 text-yellow-400 mr-3" />
                <span>Instant digital delivery</span>
              </div>
              <div className="flex items-center text-gray-300">
                <CreditCard className="w-5 h-5 text-blue-400 mr-3" />
                <span>All major cards accepted</span>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-white mb-4">What You Get:</h3>
              <ul className="space-y-2 text-gray-300">
                <li>✅ Complete n8n Automation Workflow</li>
                <li>✅ VEO 3 AI Video Generation Setup</li>
                <li>✅ GROK & GPT Integration</li>
                <li>✅ Auto-posting to 3 Platforms</li>
                <li>✅ ASMR Video Templates</li>
                <li>✅ Postiz Social Media Scheduler</li>
                <li>✅ Complete Setup Guide</li>
                <li>✅ 24/7 Automation (Posts Every 8 Hours)</li>
                <li>✅ Access to Expert Automators & Support</li>
              </ul>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-4 px-6 rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black mr-3"></div>
                  Processing...
                </div>
              ) : (
                `Complete Purchase – $${veo3Product.price.toFixed(2)}`
              )}
            </button>

            <div className="text-center mt-6">
              <p className="text-gray-400 text-sm">
                Secure payment powered by Stripe • No account required
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}