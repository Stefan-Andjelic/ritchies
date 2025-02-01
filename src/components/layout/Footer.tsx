import Link from "next/link";

export default function Footer() {
    return (
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Shop</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="/products" className="text-base text-gray-500 hover:text-green-600">
                    All Products
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">About</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link href="/about" className="text-base text-gray-500 hover:text-green-600">
                    Our Story
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Contact</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link href="mailto:contact@example.com" className="text-base text-gray-500 hover:text-green-600">
                    contact@example.com
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8 text-center">
            <p className="text-base text-gray-400">
              &copy; {new Date().getFullYear()} Your Store Name. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    )
  }