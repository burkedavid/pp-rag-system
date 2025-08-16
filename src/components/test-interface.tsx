'use client';

export default function TestInterface() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 to-blue-600 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-white text-center">
          CSS Test - Blue Theme
        </h1>
        
        <div className="bg-white p-8 rounded-xl shadow-2xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            If you can see this styled properly, Tailwind is working!
          </h2>
          
          <div className="space-y-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg transition-colors">
              Test Button
            </button>
            
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <p className="text-blue-800">This is a styled card with gradients and borders.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}