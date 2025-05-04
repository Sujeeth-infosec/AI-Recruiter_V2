
'use client';

import { useState } from 'react';
import Head from 'next/head';

const PLANS = [
  {
    id: 'basic',
    name: 'Basic Plan',
    price: 300,
    features: ['Feature 1', 'Feature 2', 'Basic Support'],
    popular: false,
  },
  {
    id: 'advanced',
    name: 'Advanced Plan',
    price: 600,
    features: ['All Basic Features', 'Feature 3', 'Feature 4', 'Priority Support'],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise Plan',
    price: 1000,
    features: [
      'All Advanced Features',
      'Feature 5',
      'Feature 6',
      '24/7 Dedicated Support',
      'Custom Solutions',
    ],
    popular: false,
  },
];

export default function Billing() {
  const [selectedPlan, setSelectedPlan] = useState(PLANS[0]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const initiatePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: selectedPlan.price * 100,
          currency: 'INR',
          planId: selectedPlan.id,
          customer: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone,
          },
        }),
      });

      const { orderId, amount, currency } = await response.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount,
        currency: currency,
        name: 'Your Company',
        description: `Subscription: ${selectedPlan.name}`,
        order_id: orderId,
        handler: async function (response) {
          const verification = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              planId: selectedPlan.id,
              customer: formData,
            }),
          });

          const result = await verification.json();
          if (result.success) {
            window.location.href = `/payment-success?payment_id=${response.razorpay_payment_id}&plan=${selectedPlan.id}`;
          } else {
            alert('Payment verification failed');
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#3399cc',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </Head>

      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900">Choose Your Plan</h1>
            <p className="mt-4 text-lg text-gray-600">
              Select the plan that works best for your needs
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-lg border border-gray-200 bg-white shadow-sm flex flex-col ${
                  plan.popular ? 'ring-2 ring-indigo-500' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-indigo-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="p-6 flex-1">
                  <h2 className="text-lg font-semibold text-gray-900">{plan.name}</h2>
                  <p className="mt-4 text-3xl font-bold text-gray-900">
                    ₹{plan.price}
                    <span className="text-base font-normal text-gray-500">/month</span>
                  </p>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <svg
                          className="h-5 w-5 text-indigo-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="ml-3 text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-6 border-t border-gray-200">
                  <button
                    onClick={() => setSelectedPlan(plan)}
                    className={`w-full py-2 px-4 border rounded-md font-medium ${
                      plan.id === selectedPlan.id
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-indigo-600 border-indigo-600 hover:bg-indigo-50'
                    }`}
                  >
                    {plan.id === selectedPlan.id ? 'Selected' : 'Select Plan'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Complete Your {selectedPlan.name} Subscription
              </h2>

              <form onSubmit={initiatePayment} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processing...' : `Pay ₹${selectedPlan.price}`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}