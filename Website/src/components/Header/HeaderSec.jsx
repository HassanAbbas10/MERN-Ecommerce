

import { Truck, Clock, Shield } from "lucide-react";

const HeaderSec = () => {
  const announcements = [
    {
      icon: Truck,
      text: "Free shipping on orders over Rs 2400"
    },
    {
      icon: Shield,
      text: "Secure payments & 30-day returns"
    },
    {
      icon: Clock,
      text: "24/7 customer support available"
    }
  ];

  return (
    <div className="bg-gradient-to-r from-slate-900 to-gray-800 text-white py-2">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center">
          <div className="hidden md:flex items-center space-x-8">
            {announcements.map((item, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <item.icon className="w-4 h-4 text-blue-300" />
                <span className="text-gray-200">{item.text}</span>
              </div>
            ))}
          </div>
          
          {/* Mobile - Show only the main announcement */}
          <div className="md:hidden flex items-center space-x-2 text-sm">
            <Truck className="w-4 h-4 text-blue-300" />
            <span className="text-gray-200">Free shipping over Rs 2400</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderSec;