import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, Settings, Play, BarChart3, Users, Video, Crown } from 'lucide-react';

export function Dashboard() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-yellow-400">
                <span className="text-white">Veo3</span>Factory Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {user?.subscription_plan && (
                <div className="flex items-center space-x-2 bg-yellow-900 px-3 py-1 rounded-lg">
                  <Crown className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-200 text-sm font-medium">{user.subscription_plan}</span>
                </div>
              )}
              <span className="text-gray-300">Welcome, {user?.email}</span>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Welcome to Your <span className="text-yellow-400">Viral Content Factory</span>
          </h2>
          <p className="text-gray-300 text-lg">
            Your AI automation system is ready to create viral ASMR content. Get started with the setup guide below.
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Subscription Status</p>
                <p className={`text-2xl font-bold ${user?.subscription_status === 'active' ? 'text-green-400' : 'text-red-400'}`}>
                  {user?.subscription_status === 'active' ? 'Active' : 'Inactive'}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${user?.subscription_status === 'active' ? 'bg-green-900' : 'bg-red-900'}`}>
                <Users className={`w-6 h-6 ${user?.subscription_status === 'active' ? 'text-green-400' : 'text-red-400'}`} />
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Videos Generated</p>
                <p className="text-2xl font-bold text-yellow-400">0</p>
              </div>
              <div className="bg-yellow-900 p-3 rounded-lg">
                <Video className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Views</p>
                <p className="text-2xl font-bold text-blue-400">0</p>
              </div>
              <div className="bg-blue-900 p-3 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Conditional Content Based on Subscription Status */}
        {user?.subscription_status === 'active' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Setup Guide */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-yellow-400" />
                Setup Your Automation
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-yellow-400 text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-semibold text-white">Download n8n Workflow</h4>
                    <p className="text-gray-400 text-sm">Get the complete automation workflow file</p>
                    <button className="mt-2 bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">
                      Download Workflow
                    </button>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-gray-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-semibold text-white">Setup API Keys</h4>
                    <p className="text-gray-400 text-sm">Configure VEO 3, GROK, and social media APIs</p>
                    <button className="mt-2 bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors">
                      View Guide
                    </button>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-gray-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-semibold text-white">Test & Launch</h4>
                    <p className="text-gray-400 text-sm">Run your first automation and go viral</p>
                    <button className="mt-2 bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors">
                      Start Testing
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Resources */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Play className="w-5 h-5 mr-2 text-yellow-400" />
                Resources & Support
              </h3>
              <div className="space-y-3">
                <a href="#" className="block p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                  <h4 className="font-semibold text-white">📖 Complete Setup Guide</h4>
                  <p className="text-gray-400 text-sm">Step-by-step instructions with screenshots</p>
                </a>
                
                <a href="#" className="block p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                  <h4 className="font-semibold text-white">🎥 Video Tutorials</h4>
                  <p className="text-gray-400 text-sm">Watch the complete setup process</p>
                </a>
                
                <a href="#" className="block p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                  <h4 className="font-semibold text-white">💬 Community Support</h4>
                  <p className="text-gray-400 text-sm">Get help from other users and experts</p>
                </a>
                
                <a href="mailto:support@veo3factory.com" className="block p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                  <h4 className="font-semibold text-white">📧 Direct Support</h4>
                  <p className="text-gray-400 text-sm">Email us for personalized help</p>
                </a>
              </div>
            </div>
          </div>
        ) : (
          /* No Active Subscription */
          <div className="text-center max-w-2xl mx-auto">
            <div className="bg-gray-900 border border-red-600 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-red-400 mb-4">No Active Subscription</h3>
              <p className="text-gray-300 mb-6">
                You need an active subscription to access the Veo3Factory automation system.
              </p>
              <a
                href="/checkout"
                className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-3 px-6 rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-200"
              >
                Get Veo3Factory - $97
              </a>
            </div>
          </div>
        )}

        {/* Success Tips - Only show if user has active subscription */}
        {user?.subscription_status === 'active' && (
          <div className="mt-8 bg-gradient-to-r from-yellow-900 to-orange-900 border border-yellow-400 rounded-lg p-6">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">🚀 Pro Tips for Maximum Success</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
              <div>
                <h4 className="font-semibold mb-2">⚡ Optimize Posting Times</h4>
                <p className="text-sm text-gray-200">Schedule posts during peak hours for your target audience (usually 6-9 PM local time).</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🎯 Customize Content Themes</h4>
                <p className="text-sm text-gray-200">Experiment with different ASMR themes to find what resonates with your audience.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">📊 Monitor Performance</h4>
                <p className="text-sm text-gray-200">Track which videos perform best and adjust your automation settings accordingly.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🔄 Stay Consistent</h4>
                <p className="text-sm text-gray-200">Let the automation run consistently for at least 30 days to build momentum.</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}