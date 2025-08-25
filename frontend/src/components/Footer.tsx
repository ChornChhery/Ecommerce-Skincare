export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-[#F5F1ED] via-[#F8F4F0] to-[#FAF6F2] text-[#A2574F] overflow-hidden">
      {/* Luxury Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-[#E65087]/10 via-[#BF7587]/5 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-r from-[#993A8B]/10 via-[#A2574F]/5 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-[#BF7587]/8 via-[#E65087]/4 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '6s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
        {/* Luxury Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          {/* Luxury Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-4 mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#E65087] to-[#993A8B] rounded-3xl blur-lg opacity-30"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-[#A2574F] via-[#E65087] to-[#993A8B] rounded-3xl flex items-center justify-center shadow-2xl shadow-[#E65087]/25">
                  <span className="text-3xl">✨</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-[#BF7587] to-[#E65087] rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <span className="text-xs text-white font-bold">🌸</span>
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-[#A2574F] via-[#E65087] to-[#993A8B] bg-clip-text text-transparent">
                  Luxury Skincare
                </h3>
                <p className="text-sm text-[#BF7587] font-medium">Premium Desert Dusk Collection</p>
              </div>
            </div>
            <p className="text-[#A2574F]/80 leading-relaxed mb-8 text-lg">
              Discover our curated collection of premium skincare essentials, crafted for those who appreciate true luxury and the warm embrace of desert dusk elegance.
            </p>
            
            {/* Luxury Newsletter Signup */}
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-[#A2574F] flex items-center">
                <span className="mr-3 text-2xl">💌</span>
                Join Our Luxury Circle
              </h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email for exclusive offers"
                  className="flex-1 px-6 py-4 bg-white/80 backdrop-blur-sm border border-[#BF7587]/20 rounded-l-3xl text-[#A2574F] placeholder-[#BF7587] focus:outline-none focus:ring-2 focus:ring-[#E65087]/20 focus:border-[#E65087] transition-all duration-300"
                />
                <button className="px-8 py-4 bg-gradient-to-r from-[#E65087] to-[#993A8B] text-white font-bold rounded-r-3xl hover:shadow-xl hover:shadow-[#E65087]/25 transition-all duration-300 hover:scale-105 active:scale-95">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Luxury Quick Links */}
          <div>
            <h3 className="text-2xl font-bold mb-8 relative">
              <span className="bg-gradient-to-r from-[#E65087] to-[#993A8B] bg-clip-text text-transparent">Luxury Navigation</span>
              <div className="absolute -bottom-3 left-0 w-16 h-1 bg-gradient-to-r from-[#E65087] to-[#993A8B] rounded-full"></div>
            </h3>
            <ul className="space-y-4">
              {[
                { name: 'Luxury Home', icon: '🏛️' },
                { name: 'Premium Products', icon: '✨' },
                { name: 'Our Heritage', icon: '🌸' },
                { name: 'Concierge Contact', icon: '💎' },
                { name: 'Beauty Journal', icon: '📖' },
                { name: 'Client Reviews', icon: '⭐' }
              ].map((item) => (
                <li key={item.name}>
                  <a 
                    href="#" 
                    className="group flex items-center space-x-4 text-[#A2574F] hover:text-[#E65087] transition-all duration-300"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-[#E65087]/10 to-[#993A8B]/10 rounded-2xl flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-[#E65087]/20 group-hover:to-[#993A8B]/20 transition-all duration-300 group-hover:scale-110">
                      <span className="text-lg">{item.icon}</span>
                    </div>
                    <span className="font-semibold group-hover:translate-x-2 transition-transform duration-300">{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Luxury Customer Service */}
          <div>
            <h3 className="text-2xl font-bold mb-8 relative">
              <span className="bg-gradient-to-r from-[#BF7587] to-[#A2574F] bg-clip-text text-transparent">Luxury Care</span>
              <div className="absolute -bottom-3 left-0 w-16 h-1 bg-gradient-to-r from-[#BF7587] to-[#A2574F] rounded-full"></div>
            </h3>
            <ul className="space-y-4">
              {[
                { name: 'White Glove Delivery', icon: '🚚' },
                { name: 'Luxury Returns', icon: '↩️' },
                { name: 'Personal Consultation', icon: '👑' },
                { name: 'Exclusive FAQ', icon: '❓' },
                { name: 'VIP Order Tracking', icon: '📦' },
                { name: 'Luxury Gift Cards', icon: '🎁' }
              ].map((item) => (
                <li key={item.name}>
                  <a 
                    href="#" 
                    className="group flex items-center space-x-4 text-[#A2574F] hover:text-[#BF7587] transition-all duration-300"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-[#BF7587]/10 to-[#A2574F]/10 rounded-2xl flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-[#BF7587]/20 group-hover:to-[#A2574F]/20 transition-all duration-300 group-hover:scale-110">
                      <span className="text-lg">{item.icon}</span>
                    </div>
                    <span className="font-semibold group-hover:translate-x-2 transition-transform duration-300">{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Luxury Connect With Us */}
          <div>
            <h3 className="text-2xl font-bold mb-8 relative">
              <span className="bg-gradient-to-r from-[#993A8B] to-[#E65087] bg-clip-text text-transparent">Luxury Community</span>
              <div className="absolute -bottom-3 left-0 w-16 h-1 bg-gradient-to-r from-[#993A8B] to-[#E65087] rounded-full"></div>
            </h3>
            
            {/* Luxury Social Media Links */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { name: 'Facebook', icon: '📘', color: 'from-[#E65087] to-[#BF7587]' },
                { name: 'Instagram', icon: '📸', color: 'from-[#993A8B] to-[#E65087]' },
                { name: 'Twitter', icon: '🐦', color: 'from-[#BF7587] to-[#A2574F]' },
                { name: 'TikTok', icon: '🎵', color: 'from-[#A2574F] to-[#993A8B]' }
              ].map((social) => (
                <a
                  key={social.name}
                  href="#"
                  className={`group flex items-center justify-center w-full h-14 bg-gradient-to-r ${social.color} rounded-2xl text-white font-bold text-sm hover:shadow-xl hover:shadow-[#E65087]/20 transition-all duration-300 hover:scale-105 active:scale-95`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg group-hover:scale-110 transition-transform duration-300">
                      {social.icon}
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {social.name}
                    </span>
                  </div>
                </a>
              ))}
            </div>

            {/* Luxury Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4 text-[#A2574F]">
                <div className="w-12 h-12 bg-gradient-to-br from-[#E65087]/20 to-[#993A8B]/20 rounded-2xl flex items-center justify-center">
                  <span className="text-xl">📧</span>
                </div>
                <div>
                  <div className="font-semibold">concierge@luxuryskincare.com</div>
                  <div className="text-sm text-[#BF7587]">Luxury Support</div>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-[#A2574F]">
                <div className="w-12 h-12 bg-gradient-to-br from-[#BF7587]/20 to-[#A2574F]/20 rounded-2xl flex items-center justify-center">
                  <span className="text-xl">📱</span>
                </div>
                <div>
                  <div className="font-semibold">+1 (555) LUXURY-1</div>
                  <div className="text-sm text-[#BF7587]">VIP Hotline</div>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-[#A2574F]">
                <div className="w-12 h-12 bg-gradient-to-br from-[#993A8B]/20 to-[#E65087]/20 rounded-2xl flex items-center justify-center">
                  <span className="text-xl">🕒</span>
                </div>
                <div>
                  <div className="font-semibold">24/7 Luxury Service</div>
                  <div className="text-sm text-[#BF7587]">Always Available</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Luxury Bottom Section */}
        <div className="mt-20 pt-10 border-t border-[#BF7587]/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 text-[#A2574F]/80">
              <span className="text-lg font-medium">&copy; 2024 Luxury Skincare. All rights reserved.</span>
              <div className="flex items-center space-x-6">
                <a href="#" className="hover:text-[#E65087] transition-colors duration-300 font-medium">Privacy Policy</a>
                <a href="#" className="hover:text-[#E65087] transition-colors duration-300 font-medium">Terms of Luxury</a>
                <a href="#" className="hover:text-[#E65087] transition-colors duration-300 font-medium">Cookie Preferences</a>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <span className="text-lg text-[#A2574F] font-medium">Secured by Luxury Standards</span>
              <div className="flex items-center space-x-3">
                <div className="px-4 py-2 bg-gradient-to-r from-[#E65087]/10 to-[#993A8B]/10 border border-[#E65087]/20 rounded-2xl text-[#E65087] font-bold flex items-center space-x-2">
                  <span>🔒</span>
                  <span>Premium SSL</span>
                </div>
                <div className="px-4 py-2 bg-gradient-to-r from-[#BF7587]/10 to-[#A2574F]/10 border border-[#BF7587]/20 rounded-2xl text-[#BF7587] font-bold flex items-center space-x-2">
                  <span>💎</span>
                  <span>Luxury Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Luxury Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="absolute top-10 right-10 w-16 h-16 bg-gradient-to-r from-[#E65087] to-[#993A8B] rounded-full flex items-center justify-center text-white shadow-2xl shadow-[#E65087]/30 hover:shadow-xl hover:shadow-[#E65087]/40 transition-all duration-300 hover:scale-110 active:scale-95 group"
      >
        <svg className="w-8 h-8 group-hover:-translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-[#BF7587] to-white rounded-full flex items-center justify-center animate-pulse">
          <span className="text-xs">✨</span>
        </div>
      </button>

      <style jsx>{`
        /* Luxury animations */
        @keyframes luxuryPulse {
          0%, 100% {
            opacity: 0.8;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }

        @keyframes luxuryFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-10px) rotate(2deg);
          }
          66% {
            transform: translateY(-5px) rotate(-1deg);
          }
        }

        .luxury-pulse {
          animation: luxuryPulse 4s ease-in-out infinite;
        }

        .luxury-float {
          animation: luxuryFloat 6s ease-in-out infinite;
        }

        /* Gradient text selection */
        ::selection {
          background: linear-gradient(135deg, #E65087, #993A8B);
          color: white;
        }

        ::-moz-selection {
          background: linear-gradient(135deg, #E65087, #993A8B);
          color: white;
        }

        /* Custom scrollbar for luxury feel */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(191, 117, 135, 0.1);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #E65087, #993A8B);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #993A8B, #A2574F);
        }
      `}</style>
    </footer>
  );
}

