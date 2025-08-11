import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LeadData {
  firstName: string;
  email: string;
}

export default function Landing() {
  const [leadData, setLeadData] = useState<LeadData>({ firstName: "", email: "" });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createLeadMutation = useMutation({
    mutationFn: async (data: LeadData) => {
      await apiRequest("POST", "/api/leads", data);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Check your email for the free ebook download link!",
      });
      setLeadData({ firstName: "", email: "" });
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (leadData.firstName && leadData.email) {
      createLeadMutation.mutate(leadData);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-orange-600">
                <i className="fas fa-rocket mr-2"></i>Opian Entrepreneur
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button asChild variant="outline" className="text-gray-700 border-gray-300 hover:bg-gray-100">
                <a href="/auth">Login</a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-orange-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Urgency Banner */}
          <div className="text-center mb-8">
            <div className="bg-red-600 text-white py-3 px-6 rounded-full mb-8 inline-block animate-pulse">
              <span className="text-sm font-bold">⏰ URGENT: Price increases after first 50 buyers!</span>
            </div>
          </div>

          <div className="text-center max-w-5xl mx-auto">
            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
              🚀 Own This <span className="text-orange-600">High-Demand</span><br />
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Digital Product Series
              </span>
            </h1>
            
            {/* Subheadline */}
            <h2 className="text-2xl md:text-4xl font-bold text-gray-700 mb-8">
              With Full Master Resell Rights - <span className="text-green-600">Just $49!</span>
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed">
              Get Instant Access + The Legal Right to Sell It as Your Own & Keep 100% Profits!
            </p>

            {/* Hero Benefits */}
            <div className="bg-green-50 border-l-4 border-green-500 p-8 mb-12 text-left max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <i className="fas fa-check-circle text-green-600 text-xl mr-4 mt-1"></i>
                  <span className="text-lg font-medium text-gray-800">High-Value Digital Product Series (Videos, PDFs, Templates)</span>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-check-circle text-green-600 text-xl mr-4 mt-1"></i>
                  <span className="text-lg font-medium text-gray-800">Master Resell Rights Included – Sell It & Keep All Profits!</span>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-check-circle text-green-600 text-xl mr-4 mt-1"></i>
                  <span className="text-lg font-medium text-gray-800">Ready-to-Use Content – No Tech Skills Needed</span>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-check-circle text-green-600 text-xl mr-4 mt-1"></i>
                  <span className="text-lg font-medium text-gray-800">30-Day Money-Back Guarantee – Zero Risk!</span>
                </div>
              </div>
            </div>

            {/* Primary CTA */}
            <Button 
              asChild
              size="lg" 
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-2xl py-8 px-16 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 mb-8"
            >
              <a href="/sales" data-testid="button-get-access">🔥 GET INSTANT ACCESS NOW – $49</a>
            </Button>
            
            <p className="text-gray-500 text-sm">30-Day Money-Back Guarantee • Instant Access • No Monthly Fees</p>
          </div>
        </div>
      </section>

      {/* Problem → Solution Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">Why This Product?</h2>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="text-center">
              <div className="text-8xl mb-6">❌</div>
              <h3 className="text-3xl font-bold text-red-600 mb-6">The Problem</h3>
              <p className="text-xl text-gray-700 leading-relaxed">
                Struggling to create profitable digital products from scratch? Spending months building content 
                with no guarantee of success?
              </p>
            </div>
            <div className="text-center">
              <div className="text-8xl mb-6">✅</div>
              <h3 className="text-3xl font-bold text-green-600 mb-6">The Solution</h3>
              <p className="text-xl text-gray-700 leading-relaxed">
                Skip the hard work with our done-for-you series that's ready to sell! 
                Start earning from day one with proven products.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">What's Included?</h2>
          <p className="text-xl text-gray-600 text-center mb-16">Everything you need to start selling immediately</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <i className="fas fa-video text-white text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Training Modules</h3>
              <p className="text-gray-600">Professional video content + comprehensive PDF guides</p>
            </div>
            
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <i className="fas fa-file-alt text-white text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Sales Materials</h3>
              <p className="text-gray-600">Ready-made sales pages & proven email sequences</p>
            </div>
            
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <i className="fas fa-certificate text-white text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Master Resell License</h3>
              <p className="text-gray-600">Legal rights to rebrand and resell everything</p>
            </div>
            
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <i className="fas fa-gift text-white text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Exclusive Bonuses</h3>
              <p className="text-gray-600">Templates, checklists & implementation guides</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">Real Results from Real People</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-yellow-500">
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="fas fa-star text-xl"></i>
                  ))}
                </div>
                <span className="ml-3 text-gray-600 font-medium">Verified Purchase</span>
              </div>
              <p className="text-gray-800 mb-6 text-lg italic leading-relaxed">
                "I made $2,300 in my first week reselling this system! The materials are professional and the license is legitimate."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  S
                </div>
                <div>
                  <p className="font-bold text-gray-900">Sarah Johnson</p>
                  <p className="text-gray-600">Online Business Owner</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-yellow-500">
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="fas fa-star text-xl"></i>
                  ))}
                </div>
                <span className="ml-3 text-gray-600 font-medium">Verified Purchase</span>
              </div>
              <p className="text-gray-800 mb-6 text-lg italic leading-relaxed">
                "The best investment I've made in my online business! Everything is done-for-you and ready to implement immediately."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  M
                </div>
                <div>
                  <p className="font-bold text-gray-900">Mike Chen</p>
                  <p className="text-gray-600">Digital Entrepreneur</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-yellow-500">
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="fas fa-star text-xl"></i>
                  ))}
                </div>
                <span className="ml-3 text-gray-600 font-medium">Verified Purchase</span>
              </div>
              <p className="text-gray-800 mb-6 text-lg italic leading-relaxed">
                "Finally, a product that delivers what it promises. The quality is exceptional and support is amazing!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  A
                </div>
                <div>
                  <p className="font-bold text-gray-900">Alex Rivera</p>
                  <p className="text-gray-600">Marketing Consultant</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 text-center mb-16">Three simple steps to start earning</p>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center relative">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <span className="text-white text-3xl font-bold">1</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Purchase & Download</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Buy today and get instant access to all materials, licenses, and bonuses
              </p>
              <div className="hidden md:block absolute top-12 left-full w-12 h-0.5 bg-gray-300 transform -translate-y-1/2"></div>
            </div>
            
            <div className="text-center relative">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <span className="text-white text-3xl font-bold">2</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Customize & Brand</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Use our templates and materials to create your branded version
              </p>
              <div className="hidden md:block absolute top-12 left-full w-12 h-0.5 bg-gray-300 transform -translate-y-1/2"></div>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <span className="text-white text-3xl font-bold">3</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Sell & Profit</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Launch your sales and keep 100% of the profits - no limits!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Limited-Time Bonuses Section */}
      <section className="py-20 bg-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">Limited-Time Bonuses</h2>
          <p className="text-xl text-red-600 font-bold text-center mb-16">⏰ These bonuses expire in 24 hours!</p>
          
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center bg-white p-8 rounded-2xl shadow-lg border-l-4 border-orange-500">
              <div className="text-5xl mr-8">🔥</div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">FREE Bonus #1: High-Ticket Upsell Scripts</h3>
                <p className="text-lg text-gray-600 mb-2">Proven scripts that convert browsers into buyers</p>
                <p className="text-green-600 font-bold text-xl">Value: $97</p>
              </div>
            </div>
            
            <div className="flex items-center bg-white p-8 rounded-2xl shadow-lg border-l-4 border-orange-500">
              <div className="text-5xl mr-8">🔥</div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">FREE Bonus #2: Done-For-You Email Campaigns</h3>
                <p className="text-lg text-gray-600 mb-2">Complete email sequences for maximum conversions</p>
                <p className="text-green-600 font-bold text-xl">Value: $147</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Special Launch Pricing</h2>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 mb-12">
            <div className="text-7xl md:text-9xl font-bold mb-6">
              $49
            </div>
            <div className="text-3xl md:text-4xl mb-6">
              <span className="line-through opacity-75">$197</span>
              <span className="ml-4 bg-green-500 px-4 py-2 rounded-full text-xl">Save 75%!</span>
            </div>
            
            <div className="flex items-center justify-center mb-8">
              <i className="fas fa-shield-alt text-3xl mr-4"></i>
              <span className="text-xl">30-Day Money-Back Guarantee</span>
            </div>
            
            <Button 
              asChild
              size="lg" 
              className="bg-white text-orange-600 hover:bg-gray-100 font-bold text-2xl py-8 px-16 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 mb-6"
            >
              <a href="/sales" data-testid="button-buy-now">👉 YES! I WANT MASTER RESELL RIGHTS NOW</a>
            </Button>
            
            <p className="text-lg opacity-90">One-time payment • No hidden fees • Instant access</p>
          </div>
          
          <div className="text-center">
            <div className="bg-yellow-400 text-black px-6 py-3 rounded-full inline-block font-bold text-lg animate-pulse">
              ⚠️ ONLY 50 COPIES AVAILABLE AT THIS PRICE!
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">Frequently Asked Questions</h2>
          
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-3">❓</span>
                Can I really sell this as my own product?
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed pl-8">
                <span className="text-green-600 font-bold">✅ Absolutely!</span> The Master Resell Rights license gives you complete legal authority to rebrand, customize, and sell these products as your own. You keep 100% of the profits with no royalties or ongoing fees.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-3">❓</span>
                What if I'm not satisfied with my purchase?
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed pl-8">
                <span className="text-green-600 font-bold">✅ Zero risk!</span> We offer a full 30-day money-back guarantee. If you're not completely satisfied, simply contact us for a full refund - no questions asked.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-3">❓</span>
                How quickly can I access the products?
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed pl-8">
                <span className="text-green-600 font-bold">✅ Instant delivery!</span> Immediately after your purchase is complete, you'll receive an email with download links to all products, bonuses, and your Master Resell Rights license.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-yellow-50 border-t-4 border-yellow-400">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <Badge variant="destructive" className="text-xl px-6 py-3 animate-pulse">
              ⏰ FINAL WARNING: Price increases to $97 after 50 sales!
            </Badge>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            Don't Miss This Opportunity
          </h2>
          
          <p className="text-xl text-gray-700 mb-12 leading-relaxed">
            Join hundreds of entrepreneurs who are already building profitable businesses with our proven system.
            The price will never be this low again.
          </p>
          
          <Button 
            asChild
            size="lg" 
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-2xl py-8 px-16 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <a href="/sales" data-testid="button-final-cta">🚀 SECURE MY COPY NOW - $49</a>
          </Button>
          
          <p className="text-gray-600 mt-6">30-Day Guarantee • Instant Download • Master Resell Rights Included</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-500 mb-6">
              <i className="fas fa-rocket mr-2"></i>Opian Entrepreneur
            </div>
            
            <div className="flex justify-center space-x-8 mb-6">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Contact Support</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Refund Policy</a>
            </div>
            
            <div className="border-t border-gray-800 pt-6">
              <p className="text-gray-400">&copy; 2025 Opian Entrepreneur. All rights reserved.</p>
              <p className="text-gray-500 text-sm mt-2">
                This site is not part of Facebook or Meta Inc. Additionally, this site is not endorsed by Facebook in any way.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}