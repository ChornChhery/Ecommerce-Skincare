export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <span className="text-2xl">🧴</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                  Skincare Store
                </h3>
                <p className="text-sm text-slate-400">Premium Beauty Collection</p>
              </div>
            </div>
            <p className="text-slate-300 leading-relaxed mb-6">
              Discover premium skincare solutions crafted for your unique beauty journey. We bring you the finest products from around the world.
            </p>
            
            {/* Newsletter Signup */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white">Stay Updated</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-l-xl text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent"
                />
                <button className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-r-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 relative">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Quick Links</span>
              <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600"></div>
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'Home', icon: '🏠' },
                { name: 'Products', icon: '🧴' },
                { name: 'About Us', icon: '💫' },
                { name: 'Contact', icon: '📞' },
                { name: 'Blog', icon: '📝' },
                { name: 'Reviews', icon: '⭐' }
              ].map((item) => (
                <li key={item.name}>
                  <a 
                    href="#" 
                    className="group flex items-center space-x-3 text-slate-300 hover:text-white transition-colors duration-300"
                  >
                    <span className="text-sm group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-bold mb-6 relative">
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Customer Care</span>
              <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-green-500 to-emerald-600"></div>
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'Shipping Info', icon: '🚚' },
                { name: 'Returns & Exchanges', icon: '↩️' },
                { name: 'Size Guide', icon: '📏' },
                { name: 'FAQ', icon: '❓' },
                { name: 'Track Your Order', icon: '📦' },
                { name: 'Gift Cards', icon: '🎁' }
              ].map((item) => (
                <li key={item.name}>
                  <a 
                    href="#" 
                    className="group flex items-center space-x-3 text-slate-300 hover:text-white transition-colors duration-300"
                  >
                    <span className="text-sm group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Connect With Us */}
          <div>
            <h3 className="text-lg font-bold mb-6 relative">
              <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">Connect With Us</span>
              <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-pink-500 to-rose-600"></div>
            </h3>
            
            {/* Social Media Links */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { name: 'Facebook', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z', color: 'from-blue-500 to-blue-600' },
                { name: 'Instagram', icon: 'M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM12 16.624c-2.563 0-4.637-2.074-4.637-4.637S9.437 7.35 12 7.35s4.637 2.074 4.637 4.637S14.563 16.624 12 16.624z', color: 'from-pink-500 to-purple-600' },
                { name: 'Twitter', icon: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z', color: 'from-blue-400 to-blue-500' },
                { name: 'TikTok', icon: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z', color: 'from-black to-gray-800' }
              ].map((social) => (
                <a
                  key={social.name}
                  href="#"
                  className={`group flex items-center justify-center w-full h-12 bg-gradient-to-r ${social.color} rounded-xl text-white font-semibold text-sm hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95`}
                >
                  <span className="group-hover:scale-110 transition-transform duration-300">
                    {social.name}
                  </span>
                </a>
              ))}
            </div>

            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3 text-slate-300">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  📧
                </div>
                <span>support@skincarestore.com</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-300">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  📱
                </div>
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-300">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  🕒
                </div>
                <span>Mon-Fri: 9AM-6PM EST</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-slate-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6 text-sm text-slate-400">
              <span>&copy; 2024 Skincare Store. All rights reserved.</span>
              <a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors duration-300">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors duration-300">Cookies</a>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-400">Secured by</span>
              <div className="flex items-center space-x-2">
                <div className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-xs font-semibold">
                  🔒 SSL
                </div>
                <div className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 text-xs font-semibold">
                  💳 Secure
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="absolute top-8 right-8 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-110 active:scale-95"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </footer>
  );
}