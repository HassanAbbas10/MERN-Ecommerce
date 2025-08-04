import { Link } from "react-router-dom";
import { 
  ShoppingBag, 
  Mail, 
  Phone, 
  MapPin, 
  Heart,
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Shield,
  Truck,
  RefreshCw,
  CreditCard
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { name: "All Products", href: "/products" },
      { name: "Categories", href: "/categories" },
      { name: "New Arrivals", href: "/products?filter=new" },
      { name: "Best Sellers", href: "/products?filter=bestsellers" },
      { name: "Sale Items", href: "/products?filter=sale" },
    ],
    support: [
      { name: "Contact Us", href: "/contact" },
      { name: "FAQ", href: "/faq" },
      { name: "Shipping Info", href: "/shipping" },
      { name: "Returns", href: "/returns" },
      { name: "Size Guide", href: "/size-guide" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Press", href: "/press" },
      { name: "Sustainability", href: "/sustainability" },
      { name: "Blog", href: "/blog" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "Accessibility", href: "/accessibility" },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/devshop' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/devshop' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/devshop' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/devshop' }
  ];

  const trustSignals = [
    { icon: Shield, text: 'Secure Shopping' },
    { icon: Truck, text: 'Fast Delivery' },
    { icon: RefreshCw, text: 'Easy Returns' },
    { icon: CreditCard, text: 'Safe Payments' }
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Trust Signals Bar */}
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {trustSignals.map((item, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-primary-600" />
                </div>
                <p className="text-sm font-medium text-gray-900">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                  DevShop
                </span>
              </Link>
              
              <p className="text-gray-600 max-w-md leading-relaxed">
                Your trusted destination for quality products at unbeatable prices. 
                We&apos;re committed to delivering excellence in every purchase.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-600">
                  <Mail className="w-5 h-5" />
                  <span className="text-sm">hassanabbas05674@gmail.com</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <Phone className="w-5 h-5" />
                  <span className="text-sm">+92 (123) 456-7890</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <MapPin className="w-5 h-5" />
                  <span className="text-sm">Orion Street, Garden of Memories, Pakistan</span>
                </div>
              </div>
            </div>

            {/* Shop Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Shop</h3>
              <ul className="space-y-3">
                {footerLinks.shop.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.href} 
                      className="text-gray-600 hover:text-primary-600 transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Support</h3>
              <ul className="space-y-3">
                {footerLinks.support.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.href} 
                      className="text-gray-600 hover:text-primary-600 transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Company</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.href} 
                      className="text-gray-600 hover:text-primary-600 transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Legal</h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.href} 
                      className="text-gray-600 hover:text-primary-600 transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-gray-500 text-sm">
              <span>© {currentYear} DevShop. Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>in Pakistan</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 mr-2">Follow us:</span>
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-gray-100 hover:bg-primary-100 rounded-full flex items-center justify-center transition-colors duration-200 group"
                  aria-label={social.name}
                >
                  <social.icon className="w-4 h-4 text-gray-600 group-hover:text-primary-600" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
