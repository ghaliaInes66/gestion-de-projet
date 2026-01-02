import React, { useState } from 'react';
import { Check, ArrowRight, Sparkles, Zap, Users, Clock, Menu, X, Star, CheckCircle2 } from 'lucide-react';

const LoginPage = ({ onLogin }) => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    remember: false,
    agree: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Successfully registered! This is just a demo');
  };

  const LandingPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-amber-200/25 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <nav className="relative bg-white/60 backdrop-blur-xl border-b border-amber-100/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl blur opacity-50"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-7 h-7 text-amber-900" strokeWidth={2.5} />
                </div>
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-amber-900 to-orange-900 bg-clip-text text-transparent tracking-tight">
                TaskFlow
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-700 hover:text-amber-900 transition-all font-medium">Features</a>
              <a href="#pricing" className="text-gray-700 hover:text-amber-900 transition-all font-medium">Pricing</a>
              <a href="#about" className="text-gray-700 hover:text-amber-900 transition-all font-medium">About</a>
              <button 
                onClick={() => setCurrentPage('login')}
                className="text-amber-900 hover:text-amber-700 transition-all font-semibold"
              >
                Sign In
              </button>
              <button 
                onClick={() => setCurrentPage('signup')}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur opacity-50 group-hover:opacity-75 transition"></div>
                <div className="relative bg-gradient-to-r from-yellow-300 to-orange-300 text-amber-900 px-7 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                  Get Started
                </div>
              </button>
            </div>

            <button 
              className="md:hidden text-gray-700"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {menuOpen && (
            <div className="md:hidden mt-6 space-y-4 pb-6">
              <a href="#features" className="block text-gray-700 hover:text-amber-900 font-medium">Features</a>
              <a href="#pricing" className="block text-gray-700 hover:text-amber-900 font-medium">Pricing</a>
              <a href="#about" className="block text-gray-700 hover:text-amber-900 font-medium">About</a>
              <button 
                onClick={() => setCurrentPage('login')}
                className="block w-full text-left text-amber-900 font-semibold"
              >
                Sign In
              </button>
              <button 
                onClick={() => setCurrentPage('signup')}
                className="block w-full bg-gradient-to-r from-yellow-300 to-orange-300 text-amber-900 px-7 py-3 rounded-full font-bold"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-32">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-200/60 rounded-full mb-8 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span className="text-amber-900 font-semibold text-sm">Boost your productivity by 10x</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-gray-900 mb-8 leading-[1.1] tracking-tight">
            Manage Tasks
            <br />
            <span className="relative inline-block">
              <span className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-300 blur-2xl opacity-40"></span>
              <span className="relative bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Like a Pro</span>
            </span>
          </h1>
          
          <p className="text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            The elegant solution for managing your daily tasks. Simple, powerful, and beautifully designed.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-20">
            <button 
              onClick={() => setCurrentPage('signup')}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition"></div>
              <div className="relative bg-gradient-to-r from-yellow-300 to-orange-300 text-amber-900 px-10 py-5 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 flex items-center gap-3">
                Start For Free
                <ArrowRight className="w-6 h-6" strokeWidth={3} />
              </div>
            </button>
            <button className="bg-white/80 backdrop-blur-sm border-2 border-amber-200 text-amber-900 px-10 py-5 rounded-full font-bold text-lg hover:bg-white hover:border-amber-300 transition-all shadow-lg">
              Watch Demo
            </button>
          </div>

          {/* Hero Illustration */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-200/30 to-orange-200/30 rounded-3xl blur-2xl"></div>
            <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-amber-100/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { 
                    title: 'Website Redesign', 
                    status: 'Completed', 
                    gradient: 'from-green-300 to-emerald-300',
                    icon: <CheckCircle2 className="w-6 h-6" />,
                    progress: 100
                  },
                  { 
                    title: 'Content Writing', 
                    status: 'In Progress', 
                    gradient: 'from-blue-300 to-cyan-300',
                    icon: <Clock className="w-6 h-6" />,
                    progress: 65
                  },
                  { 
                    title: 'Final Review', 
                    status: 'Upcoming', 
                    gradient: 'from-yellow-300 to-orange-300',
                    icon: <Star className="w-6 h-6" />,
                    progress: 0
                  }
                ].map((task, idx) => (
                  <div key={idx} className={`relative group`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${task.gradient} rounded-2xl blur opacity-40 group-hover:opacity-60 transition`}></div>
                    <div className={`relative bg-gradient-to-br ${task.gradient} p-7 rounded-2xl text-white shadow-lg transform hover:scale-105 transition-all`}>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-semibold opacity-90 bg-white/20 px-3 py-1 rounded-full">{task.status}</span>
                        {task.icon}
                      </div>
                      <h3 className="font-bold text-xl mb-3">{task.title}</h3>
                      <div className="bg-white/30 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-white h-full rounded-full transition-all duration-1000"
                          style={{width: `${task.progress}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative bg-white/40 backdrop-blur-xl py-28 border-y border-amber-100/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-block px-5 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full mb-6">
              <span className="text-amber-900 font-bold text-sm">FEATURES</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">Everything You Need</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Powerful features designed to make task management effortless</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-10 h-10" strokeWidth={2} />,
                title: 'Lightning Fast',
                desc: 'Intuitive interface that helps you get started instantly with zero learning curve',
                gradient: 'from-yellow-300 to-orange-300',
                iconBg: 'from-yellow-400 to-orange-400'
              },
              {
                icon: <Users className="w-10 h-10" strokeWidth={2} />,
                title: 'Team Collaboration',
                desc: 'Share tasks with your team and collaborate seamlessly in real-time',
                gradient: 'from-blue-300 to-cyan-300',
                iconBg: 'from-blue-400 to-cyan-400'
              },
              {
                icon: <Clock className="w-10 h-10" strokeWidth={2} />,
                title: 'Smart Reminders',
                desc: 'Never miss a deadline with intelligent notifications and reminders',
                gradient: 'from-green-300 to-emerald-300',
                iconBg: 'from-green-400 to-emerald-400'
              }
            ].map((feature, idx) => (
              <div key={idx} className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500`}></div>
                <div className="relative bg-white/80 backdrop-blur-sm p-10 rounded-3xl border border-amber-100/50 hover:border-amber-200/80 transition-all shadow-lg hover:shadow-2xl">
                  <div className="relative mb-8">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.iconBg} rounded-2xl blur opacity-40`}></div>
                    <div className={`relative w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-amber-900 shadow-lg group-hover:scale-110 transition-transform`}>
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            {[
              { number: '50K+', label: 'Active Users' },
              { number: '1M+', label: 'Tasks Completed' },
              { number: '99.9%', label: 'Uptime' }
            ].map((stat, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/30 to-orange-200/30 rounded-3xl blur-xl group-hover:blur-2xl transition"></div>
                <div className="relative">
                  <div className="text-6xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3">
                    {stat.number}
                  </div>
                  <div className="text-xl text-gray-600 font-semibold">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-28">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-200/40 to-orange-200/40 blur-3xl"></div>
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <div className="bg-white/60 backdrop-blur-xl rounded-[3rem] p-16 shadow-2xl border border-amber-100/50">
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">Ready to Get Started?</h2>
            <p className="text-2xl text-gray-600 mb-10 max-w-2xl mx-auto">Join thousands of users who've transformed their productivity</p>
            <button 
              onClick={() => setCurrentPage('signup')}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition"></div>
              <div className="relative bg-gradient-to-r from-yellow-300 to-orange-300 text-amber-900 px-12 py-6 rounded-full font-black text-xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105">
                Create Free Account
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative bg-white/40 backdrop-blur-xl border-t border-amber-100/50 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-2xl flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-7 h-7 text-amber-900" strokeWidth={2.5} />
            </div>
            <span className="text-3xl font-bold text-gray-900">TaskFlow</span>
          </div>
          <p className="text-gray-600 font-medium">© 2024 TaskFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );

  const Login = () => (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-yellow-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/40 to-orange-200/40 rounded-[2.5rem] blur-2xl"></div>
        <div className="relative bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-12 border border-amber-100/50">
          <div className="text-center mb-10">
            <div className="inline-block relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-3xl blur opacity-50"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-3xl flex items-center justify-center shadow-xl">
                <CheckCircle2 className="w-12 h-12 text-amber-900" strokeWidth={2.5} />
              </div>
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-3">Welcome Back</h2>
            <p className="text-gray-600 text-lg">Sign in to continue your journey</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-bold mb-3 text-sm">EMAIL ADDRESS</label>
              <input 
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                className="w-full px-5 py-4 rounded-2xl border-2 border-amber-200/50 bg-white/50 focus:border-amber-300 focus:bg-white focus:outline-none transition-all text-gray-900 placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-3 text-sm">PASSWORD</label>
              <input 
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full px-5 py-4 rounded-2xl border-2 border-amber-200/50 bg-white/50 focus:border-amber-300 focus:bg-white focus:outline-none transition-all text-gray-900"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center group cursor-pointer">
                <input 
                  type="checkbox" 
                  name="remember"
                  checked={formData.remember}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded-lg border-2 border-amber-300 text-amber-500 focus:ring-amber-300" 
                />
                <span className="ml-3 text-gray-700 font-medium group-hover:text-amber-900 transition">Remember me</span>
              </label>
              <a href="#" className="text-amber-900 hover:text-amber-700 font-bold text-sm transition">Forgot Password?</a>
            </div>

            <button 
              onClick={onLogin}
              //onClick={handleSubmit}
              className="relative w-full group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl blur opacity-50 group-hover:opacity-75 transition"></div>
              <div className="relative bg-gradient-to-r from-yellow-300 to-orange-300 text-amber-900 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-[1.02]">
                Sign In
              </div>
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 font-medium">
              Don't have an account?{' '}
              <button 
                onClick={() => setCurrentPage('signup')}
                className="text-amber-900 hover:text-amber-700 font-bold transition"
              >
                Create Account
              </button>
            </p>
          </div>

          <button 
            onClick={() => setCurrentPage('landing')}
            className="mt-8 text-gray-500 hover:text-gray-700 font-semibold text-sm flex items-center justify-center w-full transition group"
          >
            <ArrowRight className="w-4 h-4 mr-2 rotate-180 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );

  const SignupPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-yellow-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/40 to-orange-200/40 rounded-[2.5rem] blur-2xl"></div>
        <div className="relative bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-12 border border-amber-100/50">
          <div className="text-center mb-10">
            <div className="inline-block relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-3xl blur opacity-50"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-3xl flex items-center justify-center shadow-xl">
                <CheckCircle2 className="w-12 h-12 text-amber-900" strokeWidth={2.5} />
              </div>
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-3">Create Account</h2>
            <p className="text-gray-600 text-lg">Start your productivity journey</p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-gray-700 font-bold mb-3 text-sm">FULL NAME</label>
              <input 
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="w-full px-5 py-4 rounded-2xl border-2 border-amber-200/50 bg-white/50 focus:border-amber-300 focus:bg-white focus:outline-none transition-all text-gray-900 placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-3 text-sm">EMAIL ADDRESS</label>
              <input 
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                className="w-full px-5 py-4 rounded-2xl border-2 border-amber-200/50 bg-white/50 focus:border-amber-300 focus:bg-white focus:outline-none transition-all text-gray-900 placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-3 text-sm">PASSWORD</label>
              <input 
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full px-5 py-4 rounded-2xl border-2 border-amber-200/50 bg-white/50 focus:border-amber-300 focus:bg-white focus:outline-none transition-all text-gray-900"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-3 text-sm">CONFIRM PASSWORD</label>
              <input 
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full px-5 py-4 rounded-2xl border-2 border-amber-200/50 bg-white/50 focus:border-amber-300 focus:bg-white focus:outline-none transition-all text-gray-900"
              />
            </div>

            <label className="flex items-start group cursor-pointer">
              <input 
                type="checkbox" 
                name="agree"
                checked={formData.agree}
                onChange={handleInputChange}
                className="w-5 h-5 rounded-lg border-2 border-amber-300 text-amber-500 focus:ring-amber-300 mt-0.5" 
              />
              <span className="ml-3 text-gray-600 text-sm leading-relaxed">
                I agree to the{' '}
                <a href="#" className="text-amber-900 hover:text-amber-700 font-bold">Terms & Conditions</a>
                {' '}and{' '}
                <a href="#" className="text-amber-900 hover:text-amber-700 font-bold">Privacy Policy</a>
              </span>
            </label>

            <button 
              //onClick={handleSubmit}
              onClick={onLogin}
              className="relative w-full group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl blur opacity-50 group-hover:opacity-75 transition"></div>
              <div className="relative bg-gradient-to-r from-yellow-300 to-orange-300 text-amber-900 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-[1.02]">
                Create Account
              </div>
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 font-medium">
              Already have an account?{' '}
              <button 
                onClick={() => setCurrentPage('login')}
                className="text-amber-900 hover:text-amber-700 font-bold transition"
              >
                Sign In
              </button>
            </p>
          </div>

          <button 
            onClick={() => setCurrentPage('landing')}
            className="mt-8 text-gray-500 hover:text-gray-700 font-semibold text-sm flex items-center justify-center w-full transition group"
          >
            <ArrowRight className="w-4 h-4 mr-2 rotate-180 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {currentPage === 'landing' && <LandingPage />}
      {currentPage === 'login' && <Login />}
      {currentPage === 'signup' && <SignupPage />}
    </>
  );
};

export default LoginPage;