import { useState, useEffect } from "react";
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

// Testimonials data
const testimonials = [
  {
    id: 1,
    text: "I made $2,300 in my first week reselling this system! The materials are professional and the license is legitimate.",
    name: "Sarah Johnson",
    role: "Online Business Owner",
    initial: "S",
    color: "green-500"
  },
  {
    id: 2,
    text: "The best investment I've made in my online business! Everything is done-for-you and ready to implement immediately.",
    name: "Mike Chen",
    role: "Digital Entrepreneur", 
    initial: "M",
    color: "blue-500"
  },
  {
    id: 3,
    text: "Finally, a product that delivers what it promises. The quality is exceptional and support is amazing!",
    name: "Alex Rivera",
    role: "Marketing Consultant",
    initial: "A", 
    color: "green-600"
  },
  {
    id: 4,
    text: "Made my first $1,000 in just 3 days! The step-by-step training makes everything so clear and easy to follow.",
    name: "Jessica Williams",
    role: "Freelancer",
    initial: "J",
    color: "blue-600"
  },
  {
    id: 5,
    text: "This is exactly what I needed to scale my business. The master resell rights give me complete freedom to profit.",
    name: "David Thompson",
    role: "E-commerce Owner",
    initial: "D",
    color: "green-500"
  }
];



// Auto-rotating testimonials carousel component
function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12 bg-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Real Results from Real People</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Join hundreds of entrepreneurs already profiting from our system</p>
        </div>
        
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-1000 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                <div className="max-w-4xl mx-auto">
                  <div className="bg-white p-8 rounded-xl shadow-lg border-l-4 border-green-500">
                    <div className="flex items-center justify-center mb-6">
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="w-5 h-5 bg-green-500 rounded-full"></div>
                        ))}
                      </div>
                      <span className="ml-3 text-gray-600 font-medium text-sm">Verified Purchase</span>
                    </div>
                    <blockquote className="text-gray-800 text-lg leading-relaxed text-center mb-6 font-medium">
                      "{testimonial.text}"
                    </blockquote>
                    <div className="flex items-center justify-center">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                        {testimonial.initial}
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-gray-900 text-lg">{testimonial.name}</p>
                        <p className="text-gray-600">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Carousel indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  index === currentIndex ? 'bg-green-500' : 'bg-gray-300'
                }`}
                onClick={() => setCurrentIndex(index)}
                data-testid={`carousel-indicator-${index}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
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
              <div className="text-2xl font-bold text-blue-600">
                Opian Entrepreneur
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
      <section className="bg-gradient-to-br from-blue-50 via-white to-green-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              {/* Urgency Banner */}
              <div className="mb-8">
                <div className="bg-blue-600 text-white py-3 px-6 rounded-lg inline-block">
                  <span className="text-sm font-bold">URGENT: Price increases after first 50 buyers!</span>
                </div>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
                Own This <span className="text-blue-600">High-Demand</span><br />
                <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Digital Product Series
                </span>
              </h1>
              
              {/* Subheadline */}
              <h2 className="text-xl md:text-2xl font-bold text-gray-700 mb-6">
                With Full Master Resell Rights - <span className="text-green-600">Just $49!</span>
              </h2>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Get Instant Access + The Legal Right to Sell It as Your Own & Keep 100% Profits!
              </p>

              {/* Hero Benefits */}
              <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span className="text-gray-800 font-medium">High-Value Digital Product Series (Videos, PDFs, Templates)</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span className="text-gray-800 font-medium">Master Resell Rights Included – Sell It & Keep All Profits!</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span className="text-gray-800 font-medium">Ready-to-Use Content – No Tech Skills Needed</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span className="text-gray-800 font-medium">30-Day Money-Back Guarantee – Zero Risk!</span>
                  </div>
                </div>
              </div>

              {/* Primary CTA */}
              <Button 
                asChild
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white font-bold text-xl py-6 px-12 rounded-xl shadow-lg mb-4"
              >
                <a href="/sales" data-testid="button-get-access">GET INSTANT ACCESS NOW – $49</a>
              </Button>
              
              <p className="text-gray-500 text-sm">30-Day Money-Back Guarantee • Instant Access • No Monthly Fees</p>
            </div>

            {/* Right Content - Placeholder for Hero Image */}
            <div className="lg:pl-8">
              <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl p-8 h-96 flex items-center justify-center">
                <svg className="w-64 h-48 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                <div className="ml-4 text-center">
                  <p className="text-gray-600 font-medium">Digital Product Preview</p>
                  <p className="text-sm text-gray-500">Professional Training Materials</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem → Solution Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Right Content */}
            <div className="lg:order-2">
              <h2 className="text-4xl font-bold text-gray-900 mb-8">Why This Product?</h2>
              
              <div className="space-y-8">
                <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-lg">
                  <h3 className="text-2xl font-bold text-red-600 mb-4">The Problem</h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Struggling to create profitable digital products from scratch? Spending months building content 
                    with no guarantee of success? Most entrepreneurs waste countless hours and money trying to develop 
                    their own products.
                  </p>
                </div>
                
                <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
                  <h3 className="text-2xl font-bold text-green-600 mb-4">The Solution</h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Skip the hard work with our done-for-you series that's ready to sell! 
                    Start earning from day one with proven products that customers actually want to buy.
                  </p>
                </div>
              </div>
            </div>

            {/* Left Content - Image Placeholder */}
            <div className="lg:order-1">
              <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl p-8 h-80 flex items-center justify-center">
                <svg className="w-48 h-32 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="ml-4">
                  <p className="text-gray-600 font-medium">Problem vs Solution</p>
                  <p className="text-sm text-gray-500">Visual Comparison</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">What's Included?</h2>
              <p className="text-xl text-gray-600 mb-10">Everything you need to start selling immediately</p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <div className="w-6 h-6 bg-white rounded"></div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Training Modules</h3>
                    <p className="text-gray-600">Professional video content + comprehensive PDF guides that teach proven strategies</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <div className="w-6 h-6 bg-white rounded"></div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Sales Materials</h3>
                    <p className="text-gray-600">Ready-made sales pages & proven email sequences that convert visitors into customers</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <div className="w-6 h-6 bg-white rounded"></div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Master Resell License</h3>
                    <p className="text-gray-600">Legal rights to rebrand and resell everything with full commercial permissions</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <div className="w-6 h-6 bg-white rounded"></div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Exclusive Bonuses</h3>
                    <p className="text-gray-600">Templates, checklists & implementation guides worth over $200</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Image Placeholder */}
            <div>
              <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl p-8 h-96 flex items-center justify-center">
                <svg className="w-64 h-48 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                </svg>
                <div className="ml-4">
                  <p className="text-gray-600 font-medium">Product Components</p>
                  <p className="text-sm text-gray-500">Complete Package Overview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section - Auto Carousel */}
      <TestimonialsCarousel />

      {/* How It Works Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">How It Works</h2>
              <p className="text-xl text-gray-600 mb-10">Three simple steps to start earning</p>
              
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                    <span className="text-white text-xl font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Purchase & Download</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Buy today and get instant access to all materials, licenses, and bonuses. Everything is delivered digitally within minutes.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                    <span className="text-white text-xl font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Customize & Brand</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Use our templates and materials to create your branded version. No technical skills required - just follow our simple guides.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                    <span className="text-white text-xl font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Sell & Profit</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Launch your sales and keep 100% of the profits. No royalties, no limits, no ongoing fees ever.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Image Placeholder */}
            <div>
              <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl p-8 h-96 flex items-center justify-center">
                <svg className="w-64 h-48 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <div className="ml-4">
                  <p className="text-gray-600 font-medium">Step-by-Step Process</p>
                  <p className="text-sm text-gray-500">Simple Implementation Guide</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Limited-Time Bonuses Section */}
      <section className="py-12 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Right Content */}
            <div className="lg:order-2">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Limited-Time Bonuses</h2>
              <p className="text-xl text-blue-600 font-bold mb-10">These bonuses expire in 24 hours!</p>
              
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">FREE Bonus: High-Ticket Upsell Scripts</h3>
                      <p className="text-gray-600 mb-2">Proven scripts that convert browsers into buyers</p>
                      <p className="text-green-600 font-bold">Value: $97</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">FREE Bonus: Done-For-You Email Campaigns</h3>
                      <p className="text-gray-600 mb-2">Complete email sequences for maximum conversions</p>
                      <p className="text-green-600 font-bold">Value: $147</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Left Content - Image Placeholder */}
            <div className="lg:order-1">
              <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl p-8 h-80 flex items-center justify-center">
                <svg className="w-48 h-32 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                <div className="ml-4">
                  <p className="text-gray-600 font-medium">Bonus Materials</p>
                  <p className="text-sm text-gray-500">Extra Value Added</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12 bg-gradient-to-br from-green-500 via-blue-500 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div>
              <h2 className="text-4xl font-bold mb-8">Special Launch Pricing</h2>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
                <div className="text-6xl font-bold mb-4">$49</div>
                <div className="text-2xl mb-4">
                  <span className="line-through opacity-75">$197</span>
                  <span className="ml-4 bg-white text-green-600 px-3 py-1 rounded-full text-lg font-bold">Save 75%!</span>
                </div>
                
                <div className="flex items-center mb-6">
                  <div className="w-6 h-6 bg-white rounded-full mr-3"></div>
                  <span className="text-lg">30-Day Money-Back Guarantee</span>
                </div>
                
                <Button 
                  asChild
                  size="lg" 
                  className="bg-white text-green-600 hover:bg-gray-100 font-bold text-xl py-6 px-12 rounded-xl shadow-lg w-full mb-4"
                >
                  <a href="/sales" data-testid="button-buy-now">YES! I WANT MASTER RESELL RIGHTS NOW</a>
                </Button>
                
                <p className="text-sm opacity-90">One-time payment • No hidden fees • Instant access</p>
              </div>
              
              <div className="text-center">
                <div className="bg-white text-green-600 px-6 py-3 rounded-lg inline-block font-bold">
                  ONLY 50 COPIES AVAILABLE AT THIS PRICE!
                </div>
              </div>
            </div>

            {/* Right Content - Image Placeholder */}
            <div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 h-96 flex items-center justify-center">
                <svg className="w-64 h-48 text-white/50" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div className="ml-4">
                  <p className="text-white font-medium">Limited Time Offer</p>
                  <p className="text-sm text-white/80">Secure Your Copy Now</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Right Content */}
            <div className="lg:order-2">
              <h2 className="text-4xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
              
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Can I really sell this as my own product?
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    <span className="text-green-600 font-bold">Absolutely!</span> The Master Resell Rights license gives you complete legal authority to rebrand, customize, and sell these products as your own. You keep 100% of the profits with no royalties or ongoing fees.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    What if I'm not satisfied with my purchase?
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    <span className="text-blue-600 font-bold">Zero risk!</span> We offer a full 30-day money-back guarantee. If you're not completely satisfied, simply contact us for a full refund - no questions asked.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-600">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    How quickly can I access the products?
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    <span className="text-green-600 font-bold">Instant delivery!</span> Immediately after your purchase is complete, you'll receive an email with download links to all products, bonuses, and your Master Resell Rights license.
                  </p>
                </div>
              </div>
            </div>

            {/* Left Content - Image Placeholder */}
            <div className="lg:order-1">
              <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl p-8 h-80 flex items-center justify-center">
                <svg className="w-48 h-32 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                <div className="ml-4">
                  <p className="text-gray-600 font-medium">Questions & Answers</p>
                  <p className="text-sm text-gray-500">Common Concerns Addressed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-12 bg-white border-t-4 border-green-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div>
              <div className="mb-6">
                <Badge variant="destructive" className="text-lg px-4 py-2">
                  FINAL WARNING: Price increases to $97 after 50 sales!
                </Badge>
              </div>
              
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Don't Miss This Opportunity
              </h2>
              
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Join hundreds of entrepreneurs who are already building profitable businesses with our proven system.
                The price will never be this low again.
              </p>
              
              <Button 
                asChild
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white font-bold text-xl py-6 px-12 rounded-xl shadow-lg mb-4"
              >
                <a href="/sales" data-testid="button-final-cta">SECURE MY COPY NOW - $49</a>
              </Button>
              
              <p className="text-gray-600">30-Day Guarantee • Instant Download • Master Resell Rights Included</p>
            </div>

            {/* Right Content - Image Placeholder */}
            <div>
              <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl p-8 h-80 flex items-center justify-center">
                <svg className="w-48 h-32 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                <div className="ml-4">
                  <p className="text-gray-600 font-medium">Take Action Now</p>
                  <p className="text-sm text-gray-500">Limited Time Offer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500 mb-6">
              Opian Entrepreneur
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