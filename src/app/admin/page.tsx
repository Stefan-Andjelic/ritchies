export default function AdminDashboard() {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Hello, Admin!</h1>
        <p className="text-gray-600">
          Welcome to your dashboard. Here you can manage your products and orders.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="bg-green-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-green-800 mb-2">Products</h2>
            <p className="text-green-600">Manage your product inventory</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-blue-800 mb-2">Orders</h2>
            <p className="text-blue-600">View and manage orders</p>
          </div>
        </div>
      </div>
    )
  }