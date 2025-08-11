import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-brand-blue">
                <i className="fas fa-rocket mr-2"></i>DigitalPro
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            Build Your <span className="text-brand-blue">Digital Empire</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-8">
            Get instant access to our FREE "Digital Product Empire" ebook and discover the exact blueprint to create a 6-figure online business with Master Resell Rights
          </p>
          
          {/* Lead Capture Form */}
          <Card className="max-w-md mx-auto bg-white shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-gray-800">
                🎁 Get Your FREE Ebook Now!
              </CardTitle>
              <p className="text-gray-600 text-center">
                No spam, just proven strategies that work
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Your First Name"
                  value={leadData.firstName}
                  onChange={(e) => setLeadData({ ...leadData, firstName: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
                <Input
                  type="email"
                  placeholder="Your Email Address"
                  value={leadData.email}
                  onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
                <Button 
                  type="submit"
                  disabled={createLeadMutation.isPending}
                  className="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors"
                >
                  {createLeadMutation.isPending ? "Sending..." : "Get My FREE Ebook! 📚"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-download text-white text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Instant Download</h3>
            <p className="text-gray-600">Get immediate access to your digital products with no waiting</p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-certificate text-white text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Master Resell Rights</h3>
            <p className="text-gray-600">Sell these products as your own and keep 100% of the profits</p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="w-16 h-16 bg-brand-orange rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-rocket text-white text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Proven System</h3>
            <p className="text-gray-600">Follow our step-by-step blueprint to build a profitable business</p>
          </div>
        </div>

        {/* Social Proof */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">Join thousands of entrepreneurs who have transformed their lives</p>
          <div className="flex justify-center items-center space-x-8 text-gray-500">
            <div className="flex items-center">
              <i className="fas fa-users mr-2"></i>
              <span>50,000+ Downloads</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-star mr-2"></i>
              <span>4.9/5 Rating</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-shield-alt mr-2"></i>
              <span>100% Secure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}