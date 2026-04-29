export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold gradient-text mb-4">Fwins Club</h3>
            <p className="text-gray-400">"We for Us… Together We lead"</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-white transition">Home</a></li>
              <li><a href="/about" className="hover:text-white transition">About</a></li>
              <li><a href="/contact" className="hover:text-white transition">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-lg">Membership Plans</h4>
            <ul className="space-y-2 text-gray-400">
              <li>1 Year - ₹99</li>
              <li>5 Years - ₹349</li>
              <li>Lifetime - ₹499</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-lg">Connect With Us</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Email: info.fwins@gmail.com</li>
              <li>Follow us on social media</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Fwins Club. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}