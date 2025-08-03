export const STRIPE_CONFIG = {
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  products: {
    veo3Factory: {
      priceId: 'price_1234567890', // Replace with your actual Stripe price ID
      name: 'Veo3Factory Automation Pack',
      price: 9700, // $97.00 in cents
      currency: 'usd',
      description: 'Complete AI automation system for viral social media content'
    }
  }
};

export const getStripeProductConfig = () => STRIPE_CONFIG.products.veo3Factory;