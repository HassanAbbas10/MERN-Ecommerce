import { Button } from "@/components/ui/button";
import { Mail, Gift, Bell, Sparkles } from "lucide-react";
import { useState } from "react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 3000);
      setEmail("");
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 animate-pulse">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="absolute top-32 right-20 animate-bounce">
          <Gift className="w-8 h-8" />
        </div>
        <div className="absolute bottom-20 left-1/4 animate-pulse">
          <Bell className="w-5 h-5" />
        </div>
        <div className="absolute bottom-32 right-10 animate-bounce">
          <Mail className="w-7 h-7" />
        </div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl mb-6 shadow-xl">
            <Mail className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Stay In The Loop
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Subscribe to our newsletter and be the first to know about exclusive deals, 
            new arrivals, and special offers.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full px-6 py-4 rounded-2xl text-gray-900 bg-white/95 backdrop-blur-sm border-0 focus:outline-none focus:ring-4 focus:ring-blue-400/50 placeholder-gray-500 text-lg shadow-lg"
              />
            </div>
            <Button 
              type="submit"
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 shadow-lg text-lg"
            >
              {isSubscribed ? "✓ Subscribed!" : "Subscribe Now"}
            </Button>
          </form>
          
          {isSubscribed && (
            <div className="mt-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-2xl backdrop-blur-sm">
              <p className="text-green-300 text-lg font-medium">
                🎉 Thank you for subscribing! Check your inbox for a welcome offer.
              </p>
            </div>
          )}
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Gift className="w-8 h-8 text-blue-300" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Exclusive Deals</h3>
            <p className="text-blue-200 leading-relaxed">Get access to subscriber-only discounts and flash sales</p>
          </div>
          
          <div className="flex flex-col items-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Bell className="w-8 h-8 text-blue-300" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Early Access</h3>
            <p className="text-blue-200 leading-relaxed">Be first to shop new collections and limited editions</p>
          </div>
          
          <div className="flex flex-col items-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-8 h-8 text-blue-300" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Special Content</h3>
            <p className="text-blue-200 leading-relaxed">Styling tips, product insights, and curated recommendations</p>
          </div>
        </div>

        <p className="mt-8 text-sm text-blue-200/80">
          No spam, unsubscribe at any time. We respect your privacy.
        </p>
      </div>
    </section>
  );
};

export default Newsletter;
