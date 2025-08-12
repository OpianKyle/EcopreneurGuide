import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Sidebar from "@/components/Sidebar";

export default function Sales() {
  const [isVideoWatched, setIsVideoWatched] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar currentPath="/sales" />

      {/* Main Content */}
      <div className="flex-1 lg:pl-0 pt-16 lg:pt-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Headline */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            The Complete Digital Product <span className="text-brand-blue">Business Blueprint</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your life with our proven system that's helped thousands build 6-figure digital businesses
          </p>
        </div>

        {/* Video Section */}
        <Card className="mb-12">
          <CardContent className="p-8">
            <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center mb-4">
              <Button 
                onClick={() => setIsVideoWatched(true)}
                className="bg-brand-orange hover:bg-orange-600 text-white px-8 py-4 text-lg rounded-full"
              >
                <i className="fas fa-play mr-3"></i>
                Watch the Full Presentation
              </Button>
            </div>
            <p className="text-center text-gray-600">
              ⚠️ This video contains sensitive information and may be removed at any time
            </p>
          </CardContent>
        </Card>

        {/* Product Details */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">What You'll Get</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <i className="fas fa-check-circle text-brand-green mt-1"></i>
                <div>
                  <h4 className="font-semibold">Complete Business System</h4>
                  <p className="text-gray-600">Step-by-step blueprint to launch your digital empire</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <i className="fas fa-check-circle text-brand-green mt-1"></i>
                <div>
                  <h4 className="font-semibold">50+ Premium Products</h4>
                  <p className="text-gray-600">Ready-to-sell digital products with Master Resell Rights</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <i className="fas fa-check-circle text-brand-green mt-1"></i>
                <div>
                  <h4 className="font-semibold">Marketing Materials</h4>
                  <p className="text-gray-600">Sales pages, email templates, and promotional graphics</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <i className="fas fa-check-circle text-brand-green mt-1"></i>
                <div>
                  <h4 className="font-semibold">Video Training Course</h4>
                  <p className="text-gray-600">10+ hours of detailed implementation training</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Success Stories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-l-4 border-brand-blue pl-4">
                <p className="italic text-gray-700">"I made my first $10,000 in just 30 days using this system!"</p>
                <p className="text-sm text-gray-600 mt-2">- Sarah M., Entrepreneur</p>
              </div>
              <div className="border-l-4 border-brand-green pl-4">
                <p className="italic text-gray-700">"This completely changed my life. I quit my 9-5 job after 3 months."</p>
                <p className="text-sm text-gray-600 mt-2">- Mike R., Business Owner</p>
              </div>
              <div className="border-l-4 border-brand-orange pl-4">
                <p className="italic text-gray-700">"The most comprehensive business system I've ever seen."</p>
                <p className="text-sm text-gray-600 mt-2">- Lisa K., Digital Marketer</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Section */}
        <Card className="text-center mb-8">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Special Launch Price</h2>
            <div className="mb-6">
              <span className="text-lg text-gray-500 line-through">Regular Price: $497</span>
              <div className="text-5xl font-bold text-brand-red mb-2">$49</div>
              <p className="text-brand-red font-semibold">Limited Time Offer - Save $448!</p>
            </div>
            
            <Button 
              asChild
              size="lg"
              className="bg-brand-orange hover:bg-orange-600 text-white font-bold px-12 py-4 text-xl rounded-full mb-4"
            >
              <a href="/checkout">
                Get Instant Access Now! 🚀
              </a>
            </Button>
            
            <div className="grid md:grid-cols-3 gap-4 mt-8 text-sm text-gray-600">
              <div className="flex items-center justify-center">
                <i className="fas fa-shield-alt mr-2 text-brand-green"></i>
                30-Day Money Back Guarantee
              </div>
              <div className="flex items-center justify-center">
                <i className="fas fa-download mr-2 text-brand-blue"></i>
                Instant Digital Delivery
              </div>
              <div className="flex items-center justify-center">
                <i className="fas fa-lock mr-2 text-brand-orange"></i>
                Secure SSL Checkout
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Urgency */}
        <div className="text-center bg-brand-red text-white p-6 rounded-lg">
          <h3 className="text-2xl font-bold mb-2">⏰ Don't Wait - Price Increases Soon!</h3>
          <p className="text-lg">This special price is only available for a limited time. Don't miss out on this opportunity to transform your life!</p>
        </div>
        </div>
      </div>
    </div>
  );
}