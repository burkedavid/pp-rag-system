export default function TestCSS() {
  return (
    <div className="min-h-screen bg-blue-500 p-8">
      <h1 className="text-4xl font-bold text-white mb-4">CSS Test Page</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <p className="text-gray-800 mb-4">
          If you can see blue background, white text, and styled cards, Tailwind is working.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          Test Button
        </button>
      </div>
    </div>
  );
}