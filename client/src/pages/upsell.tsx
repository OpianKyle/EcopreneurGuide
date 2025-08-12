import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Sidebar from "@/components/Sidebar";

export default function Upsell() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar currentPath="/upsell" />

      {/* Main Content */}
      <div className="flex-1 lg:pl-0 pt-16 lg:pt-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Congratulations Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Congratulations on Your Purchase!
          </h1>
          <p className="text-xl text-gray-600">
            You've taken the first step towards building your digital empire
          </p>
        </div>

        {/* Special Offer Alert */}
        <Card className="bg-gradient-to-r from-brand-orange to-red-500 text-white mb-8">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">⚡ EXCLUSIVE ONE-TIME OFFER ⚡</h2>
            <p className="text-xl mb-4">
              Since you just invested in your future, I want to make you an offer you can't refuse...
            </p>
            <p className="text-lg font-semibold">
              This offer expires in 10 minutes and will NEVER be shown again!
            </p>
          </CardContent>
        </Card>

        {/* Upsell Product */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">The Complete Business Automation System</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center mb-6">
                <div className="text-white text-center">
                  <i className="fas fa-play text-4xl mb-4"></i>
                  <p>Watch This Exclusive Video</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <i className="fas fa-rocket text-brand-green mt-1"></i>
                  <div>
                    <h4 className="font-semibold">Advanced Automation Tools</h4>
                    <p className="text-gray-600">Automate your entire business with our premium software suite</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <i className="fas fa-users text-brand-blue mt-1"></i>
                  <div>
                    <h4 className="font-semibold">Private Mastermind Access</h4>
                    <p className="text-gray-600">Join our exclusive community of 7-figure entrepreneurs</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <i className="fas fa-phone text-brand-orange mt-1"></i>
                  <div>
                    <h4 className="font-semibold">1-on-1 Coaching Calls</h4>
                    <p className="text-gray-600">Get personal guidance from our top experts</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Why This Is Perfect For You</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-brand-red mb-2">$449</div>
                <p className="text-gray-600">Regular Value: $2,497</p>
                <p className="text-brand-green font-semibold">You Save $2,048!</p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">🔥 Limited Time Bonus</h4>
                <p className="text-yellow-700">Order now and get our "Million Dollar Mindset" course absolutely FREE!</p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Here's what others are saying:</h4>
                <div className="italic text-gray-700 border-l-4 border-brand-blue pl-4">
                  "This system helped me scale to $50K/month!"
                </div>
                <div className="italic text-gray-700 border-l-4 border-brand-green pl-4">
                  "I wish I had this when I started my first business."
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center space-y-6">
          <Button 
            asChild
            size="lg"
            className="bg-brand-green hover:bg-green-700 text-white font-bold px-12 py-6 text-2xl rounded-full"
          >
            <a href="/checkout?upsell=true">
              YES! Add This To My Order For Just $449
            </a>
          </Button>

          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-center justify-center">
              <i className="fas fa-shield-alt mr-2 text-brand-green"></i>
              30-Day Money Back Guarantee
            </div>
            <div className="flex items-center justify-center">
              <i className="fas fa-clock mr-2 text-brand-red"></i>
              Limited Time Offer
            </div>
            <div className="flex items-center justify-center">
              <i className="fas fa-star mr-2 text-brand-orange"></i>
              Premium Support Included
            </div>
          </div>

          <div className="mt-8">
            <Button 
              asChild
              variant="outline" 
              className="text-gray-600 border-gray-300"
            >
              <a href="/dashboard">
                No thanks, I'll stick with my current order
              </a>
            </Button>
          </div>
        </div>

        {/* Urgency Timer */}
        <Card className="mt-8 bg-red-50 border-red-200">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold text-red-700 mb-2">⏰ This Offer Expires Soon!</h3>
            <p className="text-red-600">
              Don't miss out on this exclusive opportunity. This offer will never be available again at this price.
            </p>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}