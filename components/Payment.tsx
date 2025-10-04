import React, { useState } from 'react';

// Stripe.js is loaded from a script tag in index.html, so we declare it here for TypeScript
declare const Stripe: any;

/*
  IMPORTANT: Stripe Configuration
  This component uses environment variables to securely handle your Stripe keys.
  You MUST create a .env file in your project's root directory and add the following:

  STRIPE_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxx
  STRIPE_PRICE_ID=price_xxxxxxxxxxxxxxxxxx

  - STRIPE_PUBLIC_KEY is your Stripe Publishable Key (it's safe to be public).
  - STRIPE_PRICE_ID is the ID of the price you created in your Stripe Dashboard for the report.
  - NEVER expose your Stripe Secret Key in frontend code. This component only uses the public key.
*/

interface PaymentProps {
  onBack: () => void;
}

const Payment: React.FC<PaymentProps> = ({ onBack }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;
  const stripePriceId = process.env.STRIPE_PRICE_ID;

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    if (!stripePublicKey || !stripePriceId) {
        const configError = "Payment processing is currently unavailable. Please contact support.";
        console.error("Stripe Configuration Error: Ensure STRIPE_PUBLIC_KEY and STRIPE_PRICE_ID are set in your environment variables.");
        setError(configError);
        setLoading(false);
        return;
    }
    
    try {
        const stripe = Stripe(stripePublicKey);
        const { error } = await stripe.redirectToCheckout({
            lineItems: [{ price: stripePriceId, quantity: 1 }],
            mode: 'payment',
            successUrl: `${window.location.origin}${window.location.pathname}?payment_success=true`,
            cancelUrl: `${window.location.origin}${window.location.pathname}`,
        });

        if (error) {
            console.error('Stripe redirect error:', error);
            setError(`Payment error: ${error.message}`);
        }
    } catch (e) {
        console.error("Error initializing Stripe checkout:", e);
        setError("Could not connect to the payment processor. Please try again later.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in text-center">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Unlock Your Full Report</h2>
      <p className="text-slate-600 mb-6">A one-time payment is required to generate your personalized emigration report. </p>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
      </div>}
      
      <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-lg mb-8">
        <p className="text-lg font-semibold text-slate-700">Emigration Pro Report</p>
        <p className="text-4xl font-extrabold text-indigo-600 my-2">$49.99</p>
        <p className="text-sm text-slate-500">One-time payment</p>
      </div>

      <div className="flex justify-between items-center">
        <button onClick={onBack} className="text-slate-600 font-bold py-2 px-4 rounded-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition" disabled={loading}>
          Back
        </button>
        <button
          onClick={handleCheckout}
          disabled={loading || !stripePublicKey || !stripePriceId}
          className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Redirecting...' : 'Pay with Stripe'}
        </button>
      </div>
    </div>
  );
};

export default Payment;
