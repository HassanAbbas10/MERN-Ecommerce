import { Card } from "@/components/ui/card";
import {
  Truck,
  RefreshCw,
  Shield,
  HeadphonesIcon,
  Star,
  Award,
} from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Free shipping on all orders over PKR 2400",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "30-day hassle-free return policy for all items",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Your payments are protected with bank-level security",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    description: "Round-the-clock customer support for all your needs",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Star,
    title: "Quality Guarantee",
    description: "Premium quality products with satisfaction guarantee",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Award,
    title: "Best Prices",
    description: "Competitive pricing with price match guarantee",
    color: "from-indigo-500 to-purple-500",
  },
];

const HighLights = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-4">
            <Star className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
              DevShop
            </span>
            ?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We&apos;re committed to providing you with the best shopping
            experience, from browsing to delivery and beyond.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm h-full"
            >
              {/* Animated background gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-8 transition-all duration-300`}
              />

              {/* Glow effect */}
              <div
                className={`absolute -inset-0.5 bg-gradient-to-r ${feature.color} rounded-xl blur opacity-0 group-hover:opacity-15 transition-all duration-300`}
              />

              <div className="relative z-10 p-6 h-full flex flex-col items-center text-center">
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-all duration-300 shadow-lg`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors duration-300 mb-3">
                  {feature.title}
                </h3>

                <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300 leading-relaxed text-center flex-grow">
                  {feature.description}
                </p>

                {/* Subtle arrow indicator */}
                <div className="mt-4 flex items-center text-primary-600 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="text-sm font-medium mr-1">Learn more</span>
                  <svg
                    className="w-3 h-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Enhanced trust indicators */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-md">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              Trusted by Thousands
            </h3>
            <p className="text-gray-600 text-sm">
              Join our growing community of satisfied customers
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500  to-emerald-500 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <p className="font-bold text-gray-900 text-sm">SSL Secured</p>
                <p className="text-xs text-gray-600">Bank-level security</p>
              </div>
            </div>

            <div className="hidden sm:block w-px h-8 bg-gray-200"></div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <p className="font-bold text-gray-900 text-sm">4.9/5 Rating</p>
                <p className="text-xs text-gray-600">From 5,000+ reviews</p>
              </div>
            </div>

            <div className="hidden sm:block w-px h-8 bg-gray-200"></div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <p className="font-bold text-gray-900 text-sm">
                  10,000+ Customers
                </p>
                <p className="text-xs text-gray-600">Worldwide trust</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HighLights;
