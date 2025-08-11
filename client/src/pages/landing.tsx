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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          {/* Urgency Banner */}
          <div className="bg-red-600 text-white py-2 px-4 rounded-lg mb-6 inline-block">
            <span className="text-sm font-bold">⏰ Price increases after first 50 buyers!</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4 leading-tight">
            🚀 <span className="text-orange-600">Own This High-Demand</span><br />
            Digital Product Series
          </h1>
          
          {/* Subheadline */}
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-8">
            With Full Master Resell Rights (Just $49!)
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
            Get Instant Access + The Legal Right to Sell It as Your Own & Keep 100% Profits!
          </p>

          {/* Hero Benefits */}
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-8 max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-center">
                <i className="fas fa-check-circle text-green-600 mr-3"></i>
                <span className="font-medium">High-Value Digital Product Series (Videos, PDFs, Templates)</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-check-circle text-green-600 mr-3"></i>
                <span className="font-medium">Master Resell Rights Included – Sell It & Keep All Profits!</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-check-circle text-green-600 mr-3"></i>
                <span className="font-medium">Ready-to-Use Content – No Tech Skills Needed</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-check-circle text-green-600 mr-3"></i>
                <span className="font-medium">30-Day Money-Back Guarantee – Zero Risk!</span>
              </div>
            </div>
          </div>

          {/* Primary CTA */}
          <Button 
            asChild
            size="lg" 
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xl py-6 px-12 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-200 mb-4"
          >
            <a href="/sales" data-testid="button-get-access">🔥 GET INSTANT ACCESS NOW – $49</a>
          </Button>
        </div>

        {/* Problem → Solution Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Why This Product?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center p-6 bg-red-50 rounded-xl">
              <div className="text-6xl mb-4">❌</div>
              <h3 className="text-xl font-bold text-red-600 mb-3">The Problem</h3>
              <p className="text-gray-700 font-medium">Struggling to create profitable digital products from scratch?</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-green-600 mb-3">The Solution</h3>
              <p className="text-gray-700 font-medium">Now you can skip the hard work – this done-for-you series is ready to sell!</p>
            </div>
          </div>
        </div>

        {/* What's Included Section */}
        <div className="bg-blue-50 rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">🔹 What's Included?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-white rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-video text-white text-2xl"></i>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Training Modules</h3>
              <p className="text-gray-600 text-sm">Video + PDF content</p>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-file-alt text-white text-2xl"></i>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Sales Pages</h3>
              <p className="text-gray-600 text-sm">& Email Swipes</p>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-certificate text-white text-2xl"></i>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Master Resell License</h3>
              <p className="text-gray-600 text-sm">Legally Sell It</p>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-gift text-white text-2xl"></i>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Exclusive Bonuses</h3>
              <p className="text-gray-600 text-sm">Checklist, Templates</p>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="bg-yellow-50 rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">What Our Customers Say</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="fas fa-star"></i>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-4 italic">"I made $2,300 in a week reselling this system!"</p>
              <p className="text-gray-600 font-medium">- Sarah Johnson, Online Business Owner</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="fas fa-star"></i>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-4 italic">"The best investment I've made in my online biz!"</p>
              <p className="text-gray-600 font-medium">- Mike Chen, Digital Entrepreneur</p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">How It Works (Simple Steps)</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-3xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Buy Today</h3>
              <p className="text-gray-600">Get instant access</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-3xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Rebrand & Sell</h3>
              <p className="text-gray-600">Use our done-for-you materials</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-3xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Keep 100% Profits</h3>
              <p className="text-gray-600">No royalties, no limits!</p>
            </div>
          </div>
        </div>

        {/* Limited-Time Bonuses */}
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Limited-Time Bonuses (Scarcity)</h2>
          <div className="space-y-4 mb-6">
            <div className="flex items-center bg-white p-4 rounded-lg shadow">
              <div className="text-3xl mr-4">🔥</div>
              <div>
                <h3 className="font-bold text-gray-800">FREE Bonus #1: "High-Ticket Upsell Scripts"</h3>
                <p className="text-gray-600">($97 Value)</p>
              </div>
            </div>
            <div className="flex items-center bg-white p-4 rounded-lg shadow">
              <div className="text-3xl mr-4">🔥</div>
              <div>
                <h3 className="font-bold text-gray-800">FREE Bonus #2: "Done-For-You Email Campaigns"</h3>
                <p className="text-gray-600">($147 Value)</p>
              </div>
            </div>
          </div>
          <p className="text-center text-red-600 font-bold text-lg">Bonuses expire in 24 hours!</p>
        </div>

        {/* Pricing Section */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl p-8 mb-12 text-center">
          <h2 className="text-3xl font-bold mb-6">💎 Today Only: Special Pricing</h2>
          <div className="text-6xl font-bold mb-4">
            $49 <span className="text-2xl line-through opacity-75">$197</span>
          </div>
          <p className="text-xl mb-6">Save 75%!</p>
          <div className="flex items-center justify-center mb-6">
            <i className="fas fa-shield-alt text-2xl mr-3"></i>
            <span className="text-lg">30-Day Money-Back Guarantee</span>
          </div>
          <Button 
            asChild
            size="lg" 
            className="bg-white text-orange-600 hover:bg-gray-100 font-bold text-xl py-6 px-12 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-200"
          >
            <a href="/sales" data-testid="button-buy-now">👉 YES! I WANT MASTER RESELL RIGHTS NOW</a>
          </Button>
          <p className="text-sm mt-4 opacity-90">One-time payment. No hidden fees.</p>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-bold text-gray-800 mb-2">❓ Can I really sell this as my own?</h3>
              <p className="text-gray-600">✅ Yes! The Master Resell Rights license allows you to rebrand it, sell it and keep all profits.</p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-bold text-gray-800 mb-2">❓ What if I don't like it?</h3>
              <p className="text-gray-600">✅ No risk! 30-day 100% money-back guarantee.</p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-bold text-gray-800 mb-2">❓ How do I access the product?</h3>
              <p className="text-gray-600">✅ Instant delivery! You'll get a download link immediately after purchase.</p>
            </div>
          </div>
        </div>

        {/* Final Urgency CTA */}
        <div className="text-center bg-yellow-100 border-2 border-yellow-300 rounded-2xl p-8">
          <div className="mb-6">
            <Badge variant="destructive" className="text-lg px-4 py-2">
              ⏰ Price increases to $97 after the next 50 buyers!
            </Badge>
          </div>
          <Button 
            asChild
            size="lg" 
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xl py-6 px-12 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-200"
          >
            <a href="/sales" data-testid="button-final-cta">🚀 GET INSTANT ACCESS NOW – $49</a>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center space-x-8 mb-4">
            <a href="#" className="text-gray-300 hover:text-white">Privacy Policy</a>
            <a href="#" className="text-gray-300 hover:text-white">Terms of Service</a>
            <a href="#" className="text-gray-300 hover:text-white">Contact Us</a>
          </div>
          <p className="text-gray-400">&copy; 2025 Opian Entrepreneur. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}