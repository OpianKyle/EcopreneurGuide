import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { User } from "@shared/schema";

export default function Home() {
  const { user, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect admin users to admin panel
  useEffect(() => {
    if (user && (user as User).isAdmin) {
      setLocation("/admin");
    }
  }, [user, setLocation]);

  return (
    <div className="min-h-screen bg-gray-50">
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
              <span className="text-gray-700">Welcome, {(user as User)?.firstName || "User"}!</span>
              {(user as User)?.isAdmin && (
                <Button 
                  variant="default" 
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => setLocation("/admin")}
                >
                  Admin Panel
                </Button>
              )}
              <Button 
                variant="outline" 
                className="text-gray-700 border-gray-300 hover:bg-gray-100"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
              >
                {logoutMutation.isPending ? "Logging out..." : "Logout"}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to Opian Entrepreneur, {(user as User)?.firstName || "User"}! 🚀
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            You're now part of an exclusive community of entrepreneurs building profitable digital businesses with Master Resell Rights.
          </p>
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-tachometer-alt text-white text-2xl"></i>
              </div>
              <CardTitle>Your Dashboard</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">Access your products, downloads, and track your progress</p>
              <Button asChild className="bg-brand-blue hover:bg-blue-700 w-full">
                <a href="/dashboard">Go to Dashboard</a>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-shopping-cart text-white text-2xl"></i>
              </div>
              <CardTitle>Browse Products</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">Explore our digital products with Master Resell Rights</p>
              <Button asChild className="bg-brand-green hover:bg-green-700 w-full">
                <a href="/sales">Browse Products</a>
              </Button>
            </CardContent>
          </Card>

          {(user as User)?.isAdmin && (
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-brand-orange rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-cog text-white text-2xl"></i>
                </div>
                <CardTitle>Admin Panel</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">Manage your business, orders, and customers</p>
                <Button asChild className="bg-brand-orange hover:bg-orange-600 w-full">
                  <a href="/admin">Admin Panel</a>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">What You Can Do</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-brand-blue rounded-lg flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-download text-white"></i>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Download Products</h3>
              <p className="text-sm text-gray-600">Access your purchased digital products instantly</p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 bg-brand-green rounded-lg flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-share text-white"></i>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Resell Rights</h3>
              <p className="text-sm text-gray-600">Rebrand and sell products as your own</p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 bg-brand-orange rounded-lg flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-dollar-sign text-white"></i>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Keep 100% Profits</h3>
              <p className="text-sm text-gray-600">No royalties or ongoing fees</p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 bg-brand-red rounded-lg flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-headset text-white"></i>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Support</h3>
              <p className="text-sm text-gray-600">Get help when you need it</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
