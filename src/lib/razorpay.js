export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => {
      console.error('Failed to load Razorpay script')
      resolve(false)
    }
    document.body.appendChild(script)
  })
}

export const plans = {
  '1 Year': { 
    amount: 99, 
    days: 365,
    displayAmount: '₹99'
  },
  '5 Years': { 
    amount: 349, 
    days: 1825,
    displayAmount: '₹349'
  },
  'Lifetime': { 
    amount: 499, 
    days: 36500,
    displayAmount: '₹499'
  }
}

export const createRazorpayOrder = async (planType, amount, userEmail, userId) => {
  try {
    const response = await fetch('/api/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        planType,
        amount,
        userEmail,
        userId
      })
    })
    
    if (!response.ok) {
      throw new Error('Failed to create order')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    throw error
  }
}