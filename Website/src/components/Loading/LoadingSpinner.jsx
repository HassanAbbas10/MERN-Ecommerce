import { Loader2, ShoppingBag } from "lucide-react";

const LoadingSpinner = ({ message = "Loading..." }) => {

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] py-8">
      <div className="relative">
        {/* Outer rotating ring */}
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        
        {/* Inner icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <ShoppingBag className="w-6 h-6 text-primary-600" />
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-gray-600 font-medium">{message}</p>
        <div className="flex items-center justify-center mt-2 space-x-1">
          <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

// Page-specific loading components
export const PageLoadingSpinner = ({ message = "Loading page..." }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50">
    <div className="text-center">
      <div className="relative mb-8">
        <div className="w-24 h-24 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <ShoppingBag className="w-10 h-10 text-primary-600" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2">DevShop</h2>
      <p className="text-gray-600 font-medium">{message}</p>
      
      <div className="flex items-center justify-center mt-4 space-x-1">
        <div className="w-3 h-3 bg-primary-600 rounded-full animate-pulse"></div>
        <div className="w-3 h-3 bg-primary-600 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-3 h-3 bg-primary-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  </div>
);

// Component-specific loading
export const ComponentLoadingSpinner = ({ message = "Loading..." }) => (
  <div className="flex items-center justify-center py-12">
    <div className="text-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-2" />
      <p className="text-sm text-gray-600">{message}</p>
    </div>
  </div>
);

export default LoadingSpinner;
