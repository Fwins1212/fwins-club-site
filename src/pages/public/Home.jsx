import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { plans } from '../../lib/razorpay'

export default function Home() {
  const { user } = useAuth()

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Join the Future of Leadership
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 animate-slide-up">
            "We for Us… Together We lead"
          </p>
          <p className="text-lg mb-12 max-w-3xl mx-auto text-blue-50">
            A community for students, entrepreneurs, and future nation-builders.
            Get mentorship, opportunities, and the support you need to succeed.
          </p>
          {!user && (
            <Link to="/signup" className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Start Your Journey →
            </Link>
          )}
        </div>
      </section>

      {/* Membership Plans */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 gradient-text">Membership Plans</h2>
          <p className="text-center text-gray-600 mb-12 text-lg">Choose the plan that fits your journey</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(plans).map(([plan, details]) => (
              <div key={plan} className="bg-white rounded-2xl shadow-lg p-8 card-hover">
                <h3 className="text-2xl font-bold text-center mb-4 gradient-text">{plan}</h3>
                <div className="text-5xl font-bold text-center text-blue-600 mb-6">
                  ₹{details.amount}
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Full Access to Community
                  </li>
                  <li className="flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Exclusive Events
                  </li>
                  <li className="flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Mentorship Access
                  </li>
                  {plan !== '1 Year' && (
                    <li className="flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Priority Support
                    </li>
                  )}
                </ul>
                {!user ? (
                  <Link to="/signup" className="btn-primary block text-center">Join Now</Link>
                ) : (
                  <button className="btn-secondary w-full cursor-default">Current Member</button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-text">Why Choose Fwins Club?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-md card-hover">
              <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Opportunities</h3>
              <p className="text-gray-600">Access to internships, jobs, and collaborative projects</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-md card-hover">
              <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Community</h3>
              <p className="text-gray-600">Connect with like-minded individuals and leaders</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-md card-hover">
              <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Mentorship</h3>
              <p className="text-gray-600">Learn from experienced professionals and experts</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl text-blue-100 mb-8">Join thousands of young leaders building their future</p>
          {!user && (
            <Link to="/signup" className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all duration-200 shadow-lg">
              Join Fwins Club Today →
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}