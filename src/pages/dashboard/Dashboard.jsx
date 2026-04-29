import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { plans, loadRazorpayScript } from '../../lib/razorpay'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const { user, profile, membership, refreshMembership } = useAuth()
  const [events, setEvents] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    fetchEvents()
    fetchAnnouncements()
  }, [])

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('date', new Date().toISOString())
      .order('date', { ascending: true })
      .limit(5)
    
    if (!error && data) {
      setEvents(data)
    }
  }

  const fetchAnnouncements = async () => {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)
    
    if (!error && data) {
      setAnnouncements(data)
    }
  }

  const handlePurchase = async (planType) => {
    if (!membership || membership.status !== 'active') {
      setSelectedPlan(planType)
      setProcessing(true)
      
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway')
        setProcessing(false)
        return
      }
      
      const plan = plans[planType]
      
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: plan.amount * 100,
        currency: 'INR',
        name: 'Fwins Club',
        description: `${planType} Membership`,
        handler: async (response) => {
          await verifyPayment(response, planType, plan.amount)
          setProcessing(false)
          setSelectedPlan(null)
        },
        prefill: {
          name: profile?.name || user?.email,
          email: user?.email,
        },
        theme: {
          color: '#2563eb'
        }
      }
      
      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } else {
      toast.success('You already have an active membership!')
    }
  }

  const verifyPayment = async (paymentResponse, planType, amount) => {
    try {
      const { data, error } = await supabase
        .from('memberships')
        .insert([{
          user_id: user.id,
          plan_type: planType,
          amount: amount,
          payment_id: paymentResponse.razorpay_payment_id,
          order_id: paymentResponse.razorpay_order_id,
          status: 'active'
        }])
        .select()
      
      if (error) throw error
      
      const endDate = new Date()
      endDate.setDate(endDate.getDate() + plans[planType].days)
      
      await supabase
        .from('profiles')
        .update({
          membership_type: planType,
          membership_start: new Date().toISOString(),
          membership_end: endDate.toISOString()
        })
        .eq('id', user.id)
      
      toast.success(`Successfully purchased ${planType} membership!`)
      await refreshMembership()
    } catch (error) {
      console.error('Payment verification error:', error)
      toast.error('Payment verification failed. Please contact support.')
    }
  }

  const isMembershipActive = membership && membership.status === 'active'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {profile?.name || 'Member'}!
        </h1>
        <p className="text-blue-100">Your journey to leadership continues here</p>
      </div>

      {/* Membership Status */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold gradient-text mb-4">Membership Status</h2>
        {isMembershipActive ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold text-green-900">Active {membership?.plan_type} Membership</p>
                {membership?.plan_type !== 'Lifetime' && (
                  <p className="text-sm text-green-700">
                    Valid until: {new Date(profile?.membership_end).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 mb-4">You don't have an active membership. Choose a plan to get started!</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(plans).map(([plan, details]) => (
                <button
                  key={plan}
                  onClick={() => handlePurchase(plan)}
                  disabled={processing}
                  className="btn-primary text-center disabled:opacity-50"
                >
                  Purchase {plan} - {details.displayAmount}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold gradient-text mb-4">Upcoming Events</h2>
        {events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="border-l-4 border-blue-600 bg-blue-50 p-4 rounded-r-lg">
                <h3 className="font-semibold text-lg">{event.title}</h3>
                <p className="text-gray-600 mt-1">{event.description}</p>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(event.date).toLocaleDateString()}
                  {event.location && (
                    <>
                      <svg className="w-4 h-4 ml-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.location}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No upcoming events at the moment. Check back soon!</p>
        )}
      </div>

      {/* Announcements */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold gradient-text mb-4">Latest Announcements</h2>
        {announcements.length > 0 ? (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="border-b border-gray-200 pb-4 last:border-0">
                <h3 className="font-semibold text-lg">{announcement.title}</h3>
                <p className="text-gray-600 mt-1">{announcement.content}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(announcement.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No announcements yet. Stay tuned!</p>
        )}
      </div>
    </div>
  )
}