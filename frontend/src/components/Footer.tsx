export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 xl:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-xl">🧴</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Skincare Store
                </h3>
                <p className="text-sm text-gray-600">Premium Collection</p>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed mb-6 text-sm sm:text-base">
              Discover our curated collection of premium skincare essentials, designed to help you achieve healthy, radiant skin with professional-grade products.
            </p>
            
            {/* Newsletter Signup */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900">
                Subscribe to our newsletter
              </h4>
              <div className="flex flex-col sm:flex-row">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-lg sm:rounded-l-lg sm:rounded-r-none text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <button className="mt-2 sm:mt-0 px-4 py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg sm:rounded-l-none sm:rounded-r-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <span className="ml-2 sm:hidden">Subscribe</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4 sm:mb-6">
              Quick Links
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {[
                { name: 'Home', href: '/' },
                { name: 'Products', href: '/products' },
                { name: 'About Us', href: '/about' },
                { name: 'Contact', href: '/contact' },
                { name: 'Blog', href: '/blog' },
                { name: 'Reviews', href: '/reviews' }
              ].map((item) => (
                <li key={item.name}>
                  <a 
                    href={item.href} 
                    className="text-gray-600 hover:text-blue-600 transition-colors text-sm block py-1"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Customer Service */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4 sm:mb-6">
              Customer Service
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {[
                { name: 'Shipping Info', href: '/shipping' },
                { name: 'Returns', href: '/returns' },
                { name: 'Size Guide', href: '/size-guide' },
                { name: 'FAQ', href: '/faq' },
                { name: 'Track Order', href: '/track' },
                { name: 'Gift Cards', href: '/gift-cards' }
              ].map((item) => (
                <li key={item.name}>
                  <a 
                    href={item.href} 
                    className="text-gray-600 hover:text-blue-600 transition-colors text-sm block py-1"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Connect With Us */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4 sm:mb-6">
              Connect With Us
            </h3>
            
            {/* Social Media Links */}
            <div className="flex flex-wrap gap-3 mb-6">
              {[
                { name: 'Facebook', href: '#', icon: (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                )},
                { name: 'Instagram', href: '#', icon: (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.988 11.988 11.988s11.987-5.367 11.987-11.988C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-2.509 0-4.551-2.041-4.551-4.55s2.042-4.551 4.551-4.551 4.549 2.042 4.549 4.551-2.04 4.55-4.549 4.55zm7.119 0c-2.508 0-4.55-2.041-4.55-4.55s2.042-4.551 4.55-4.551 4.549 2.042 4.549 4.551-2.041 4.55-4.549 4.55z" />
                  </svg>
                )},
                { name: 'Twitter', href: '#', icon: (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                )}
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white transition-colors"
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Contact Info */}
            <div className="space-y-3 sm:space-y-4">
              <div className="text-sm">
                <div className="font-medium text-gray-900 mb-1">Email</div>
                <div className="text-gray-600">support@skincare.com</div>
              </div>
              <div className="text-sm">
                <div className="font-medium text-gray-900 mb-1">Phone</div>
                <div className="text-gray-600">+1 (555) 123-4567</div>
              </div>
              <div className="text-sm">
                <div className="font-medium text-gray-900 mb-1">Hours</div>
                <div className="text-gray-600">Mon-Fri 9AM-6PM</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:items-center lg:space-y-0">
            <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-6 text-gray-600">
              <span className="text-sm">&copy; 2024 Skincare Store. All rights reserved.</span>
              <div className="flex flex-wrap items-center space-x-4 sm:space-x-6">
                <a href="#" className="text-sm hover:text-blue-600 transition-colors">Privacy Policy</a>
                <a href="#" className="text-sm hover:text-blue-600 transition-colors">Terms of Service</a>
                <a href="#" className="text-sm hover:text-blue-600 transition-colors">Cookie Policy</a>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
              <span className="text-sm text-gray-600 mb-2 sm:mb-0">Secured by</span>
              <div className="flex items-center space-x-2">
                <div className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 text-sm flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>SSL Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700 transition-colors z-40"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </footer>
  );
}

