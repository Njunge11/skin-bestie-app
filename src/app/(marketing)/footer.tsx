export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white p-8 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Top Section - Desktop Layout */}
        <div className="hidden lg:flex lg:flex-row justify-between items-start gap-8 mb-12">
          {/* Left Side - Contact Info */}
          <div className="bg-blue-600 p-6 rounded-lg flex-1">
            {/* <div className="h-16 bg-blue-700 rounded mb-4"></div>
            <div className="h-8 bg-blue-700 rounded"></div> */}
          </div>

          {/* Right Side - Email Subscription */}
          <div className="bg-purple-600 p-6 rounded-lg flex-1">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="h-12 bg-purple-700 rounded flex-1"></div>
              <div className="h-12 bg-yellow-400 rounded w-full sm:w-32"></div>
            </div>
            <div className="h-16 bg-purple-700 rounded mt-4"></div>
          </div>
        </div>

        {/* Mobile Layout - Contact Info First */}
        <div className="lg:hidden mb-8">
          <div className="bg-blue-600 p-6 rounded-lg mb-8">
            <div className="h-16 bg-blue-700 rounded mb-4"></div>
            <div className="h-8 bg-blue-700 rounded"></div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="bg-green-600 p-6 rounded-lg mb-8 lg:mb-12">
          <div className="flex flex-col sm:flex-row justify-start gap-4 sm:gap-8">
            <div className="h-8 bg-green-700 rounded w-32"></div>
            <div className="h-8 bg-green-700 rounded w-24"></div>
            <div className="h-8 bg-green-700 rounded w-40"></div>
            <div className="h-8 bg-green-700 rounded w-36"></div>
          </div>
        </div>

        {/* Mobile Layout - Email Subscription */}
        <div className="lg:hidden mb-8">
          <div className="bg-purple-600 p-6 rounded-lg">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="h-12 bg-purple-700 rounded flex-1"></div>
              <div className="h-12 bg-yellow-400 rounded w-full sm:w-32"></div>
            </div>
            <div className="h-16 bg-purple-700 rounded mt-4"></div>
          </div>
        </div>

        {/* Large Logo/Brand Section */}
        <div className="bg-red-600 p-12 rounded-lg mb-8">
          <div className="h-32 sm:h-40 md:h-48 bg-red-700 rounded"></div>
        </div>

        {/* Copyright */}
        <div className="bg-orange-600 p-4 rounded-lg">
          <div className="h-6 bg-orange-700 rounded w-64 mx-auto"></div>
        </div>
      </div>
    </footer>
  );
}
