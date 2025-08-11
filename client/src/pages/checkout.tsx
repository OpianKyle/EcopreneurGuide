import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "Thank you for your purchase! Redirecting to your dashboard...",
      });
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Complete Your Purchase</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement />
            <Button 
              type="submit"
              disabled={!stripe}
              className="w-full bg-brand-green hover:bg-green-700 text-white font-bold py-3"
            >
              Complete Purchase
            </Button>
          </form>
          
          <div className="mt-6 text-center space-y-2">
            <div className="flex items-center justify-center text-sm text-gray-600">
              <i className="fas fa-shield-alt mr-2 text-brand-green"></i>
              Secure SSL Checkout
            </div>
            <div className="flex items-center justify-center text-sm text-gray-600">
              <i className="fas fa-download mr-2 text-brand-blue"></i>
              Instant Digital Delivery
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [isUpsell, setIsUpsell] = useState(false);

  useEffect(() => {
    // Check if this is an upsell
    const urlParams = new URLSearchParams(window.location.search);
    const upsellParam = urlParams.get('upsell');
    setIsUpsell(upsellParam === 'true');

    // Create PaymentIntent as soon as the page loads
    const amount = upsellParam === 'true' ? 449 : 49;
    const productName = upsellParam === 'true' ? 'Business Automation System' : 'Digital Product Blueprint';
    
    apiRequest("POST", "/api/create-payment-intent", { 
      amount,
      productName,
      metadata: { isUpsell: upsellParam === 'true' }
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        console.error("Error creating payment intent:", error);
      });
  }, []);

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="text-2xl font-bold text-brand-blue">
                  <i className="fas fa-rocket mr-2"></i>DigitalPro
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Preparing your checkout...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-brand-blue">
                <i className="fas fa-rocket mr-2"></i>DigitalPro
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isUpsell ? (
                  <>
                    <div className="flex justify-between">
                      <span>Digital Product Blueprint</span>
                      <span>$49.00</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Business Automation System</span>
                      <span>$449.00</span>
                    </div>
                    <hr />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>$498.00</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between font-semibold">
                      <span>Digital Product Blueprint</span>
                      <span>$49.00</span>
                    </div>
                    <hr />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>$49.00</span>
                    </div>
                  </>
                )}
                
                <div className="mt-6 space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <i className="fas fa-check-circle text-brand-green mr-2"></i>
                    Instant digital delivery
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <i className="fas fa-shield-alt text-brand-blue mr-2"></i>
                    30-day money-back guarantee
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <i className="fas fa-certificate text-brand-orange mr-2"></i>
                    Master Resell Rights included
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trust Badges */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-4">Trusted by thousands of entrepreneurs worldwide</p>
              <div className="flex justify-center space-x-4 text-gray-400">
                <i className="fab fa-cc-visa text-2xl"></i>
                <i className="fab fa-cc-mastercard text-2xl"></i>
                <i className="fab fa-cc-paypal text-2xl"></i>
                <i className="fas fa-lock text-2xl"></i>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm />
            </Elements>
          </div>
        </div>
      </div>
    </div>
  );
}