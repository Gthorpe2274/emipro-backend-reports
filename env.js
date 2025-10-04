// IMPORTANT: DO NOT COMMIT THIS FILE TO VERSION CONTROL (e.g., Git)
// This file is for local development and should be listed in your .gitignore file.

// To make your environment variables available in the browser, this file simulates the
// `process.env` object. Replace the placeholder values with your actual keys.

window.process = {
  env: {
    // Your Google Gemini API Key
    API_KEY: 'YOUR_API_KEY_HERE',

    // Your Stripe Publishable Key
    STRIPE_PUBLIC_KEY: 'YOUR_STRIPE_PUBLIC_KEY_HERE',

    // Your Stripe Price ID
    STRIPE_PRICE_ID: 'YOUR_STRIPE_PRICE_ID_HERE',
  },
};