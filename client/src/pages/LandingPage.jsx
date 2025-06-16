import React from 'react';

// Simple Navbar component since it's imported in your original
const Navbar = () => (
    <div>

    </div>
);

const LandingPage = () => {
  const handleTryNow = () => {
    window.location.href = 'http://localhost:5173/auth';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-6xl font-bold text-yellow-800 leading-tight">
                  Explore Delicious
                  <span className="block text-gray-800">
                    Recipes
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Discover thousands of mouth-watering recipes from around the world. 
                  Search by ingredients, cuisine, or dietary preferences to find your perfect meal.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleTryNow}
                  className="bg-yellow-800 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Want to Try?
                </button>
                <button className="border-2 border-yellow-800 text-yellow-800 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-800 hover:text-white transition-all duration-300">
                  Browse Recipes
                </button>
              </div>

              {/* Stats */}
              <div className="flex space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-800">1000+</div>
                  <div className="text-gray-600 text-sm">Recipes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-800">50k+</div>
                  <div className="text-gray-600 text-sm">Food Lovers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-800">100+</div>
                  <div className="text-gray-600 text-sm">Cuisines</div>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                {/* Recipe Card Preview */}
                <div className="space-y-6">
                  <div className="aspect-video bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl flex items-center justify-center relative overflow-hidden">
                    <div className="text-6xl">🍳</div>
                    <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md">
                      <div className="text-red-500">❤️</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-gray-800">Delicious Chicken Curry</h3>
                    <p className="text-gray-600 text-sm">A flavorful and aromatic chicken curry perfect for dinner...</p>
                    <div className="flex items-center justify-between">
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">Main Course</span>
                      <span className="text-gray-500 text-sm">⭐ 4.8 (124 reviews)</span>
                    </div>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 bg-yellow-800 text-white rounded-xl p-3 shadow-lg transform rotate-6">
                  <div className="text-sm font-semibold">New Recipe!</div>
                </div>
                
                <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-3 shadow-lg transform -rotate-6 border border-gray-200">
                  <div className="text-xs text-gray-600">👨‍🍳 Chef Approved</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-yellow-800 mb-4">
              Why Choose Recipe Master?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to discover, cook, and share amazing recipes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Smart Search</h3>
              <p className="text-gray-600">Search by ingredients you have at home or filter by cuisine type and dietary preferences</p>
            </div>

            <div className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="text-5xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Vast Collection</h3>
              <p className="text-gray-600">Access thousands of recipes from professional chefs and home cooks worldwide</p>
            </div>

            <div className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Community Driven</h3>
              <p className="text-gray-600">Share your own recipes, rate others, and connect with fellow food enthusiasts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recipe Categories Preview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-yellow-800 mb-8 text-center">Popular Categories</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { emoji: '🍗', name: 'Chicken', count: '250+ recipes' },
              { emoji: '🍝', name: 'Pasta', count: '180+ recipes' },
              { emoji: '🥗', name: 'Salads', count: '120+ recipes' },
              { emoji: '🍰', name: 'Desserts', count: '200+ recipes' },
              { emoji: '🍲', name: 'Soups', count: '150+ recipes' },
              { emoji: '🥘', name: 'Curry', count: '100+ recipes' },
              { emoji: '🍕', name: 'Pizza', count: '80+ recipes' },
              { emoji: '🥪', name: 'Sandwiches', count: '90+ recipes' }
            ].map((category, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-4xl mb-3">{category.emoji}</div>
                <h3 className="font-bold text-gray-800 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-yellow-800 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Cooking?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join our community of food lovers and discover your next favorite recipe today
          </p>
          <button 
            onClick={handleTryNow}
            className="bg-white text-yellow-800 px-12 py-4 rounded-lg text-xl font-bold hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Get Started Now
          </button>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;