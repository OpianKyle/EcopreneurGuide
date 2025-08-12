import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Order, Download, User } from "@shared/schema";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect admin users to admin panel
  useEffect(() => {
    if (!isLoading && user && (user as User).isAdmin) {
      setLocation("/admin");
      return;
    }
  }, [user, isLoading, setLocation]);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/auth";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["/api/my-orders"],
    retry: false,
    enabled: isAuthenticated,
  });

  const { data: downloads = [] } = useQuery<Download[]>({
    queryKey: ["/api/my-downloads"],
    retry: false,
    enabled: isAuthenticated,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-2xl font-bold text-gray-900">
                DigitalPro
              </div>
            </div>
            
            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-6">
                <button className="text-gray-600 hover:text-gray-900 font-medium" onClick={() => setLocation("/")}>
                  Home
                </button>
                <button className="text-gray-600 hover:text-gray-900 font-medium" onClick={() => setLocation("/sales")}>
                  Products
                </button>
                <button className="text-gray-900 font-medium border-b-2 border-blue-600 pb-1">
                  Dashboard
                </button>
                <button className="text-gray-600 hover:text-gray-900 font-medium" onClick={() => setLocation("/my-purchases")}>
                  Downloads
                </button>
              </div>
              
              <div className="flex items-center space-x-3">
                {(user as User)?.isAdmin && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setLocation("/admin")}
                    className="text-sm"
                  >
                    Admin
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                  className="text-sm"
                >
                  {logoutMutation.isPending ? "..." : "Logout"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {(user as User)?.firstName || "User"}
          </h1>
          <p className="text-xl text-gray-600">
            Manage your digital product library and track your business growth
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{orders.length}</h3>
            <p className="text-gray-600 text-sm font-medium">Digital Products</p>
            <p className="text-xs text-gray-500 mt-1">Ready to resell</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{downloads.length}</h3>
            <p className="text-gray-600 text-sm font-medium">Downloads</p>
            <p className="text-xs text-gray-500 mt-1">Total downloads</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">$0</h3>
            <p className="text-gray-600 text-sm font-medium">Revenue</p>
            <p className="text-xs text-gray-500 mt-1">From reselling</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">Premium</h3>
            <p className="text-gray-600 text-sm font-medium">Membership</p>
            <p className="text-xs text-gray-500 mt-1">Active subscriber</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Product Library */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Your Digital Library</h2>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setLocation("/my-purchases")}
                    className="text-sm"
                  >
                    View All
                  </Button>
                </div>
                <p className="text-gray-600 text-sm mt-1">Ready-to-sell digital products with Master Resell Rights</p>
              </div>

              <div className="p-6">
                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm">
                              {order.productId === "digital-series" ? "Digital Product Series - Master Resell Rights" : "Complete Business System"}
                            </h3>
                            <p className="text-xs text-gray-500">
                              Purchased {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="text-xs">
                            Download
                          </Button>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs">
                            Resell
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Build Your Library</h3>
                    <p className="text-gray-600 mb-6 max-w-sm mx-auto">Start building your digital product empire with our premium PLR content</p>
                    <Button 
                      onClick={() => setLocation("/sales")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Explore Products
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button 
                  onClick={() => setLocation("/sales")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-sm justify-start"
                  size="sm"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Browse Products
                </Button>
                <Button 
                  onClick={() => setLocation("/my-purchases")}
                  variant="outline" 
                  className="w-full text-sm justify-start"
                  size="sm"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  My Downloads
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full text-sm justify-start"
                  size="sm"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Get Support
                </Button>
              </div>
            </div>

            {/* Account Status */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Premium Access</h3>
              <p className="text-sm text-gray-600 mb-4">You have unlimited access to our entire digital product library</p>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-700 font-medium">Active Membership</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity & Resources */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
            {downloads.length > 0 ? (
              <div className="space-y-4">
                {downloads.slice(0, 5).map((download) => (
                  <div key={download.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Product Downloaded</p>
                      <p className="text-xs text-gray-500">{new Date(download.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">No recent activity</p>
              </div>
            )}
          </div>

          {/* Resources & Help */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Resources & Support</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <h4 className="font-semibold text-blue-900 text-sm mb-2">Getting Started Guide</h4>
                <p className="text-xs text-blue-700 mb-3">Learn how to maximize your digital product business</p>
                <Button size="sm" variant="outline" className="text-xs border-blue-200 text-blue-700 hover:bg-blue-100">
                  View Guide
                </Button>
              </div>
              
              <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                <h4 className="font-semibold text-green-900 text-sm mb-2">Marketing Templates</h4>
                <p className="text-xs text-green-700 mb-3">Ready-made sales pages and marketing materials</p>
                <Button size="sm" variant="outline" className="text-xs border-green-200 text-green-700 hover:bg-green-100">
                  Download
                </Button>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                <h4 className="font-semibold text-purple-900 text-sm mb-2">Community Support</h4>
                <p className="text-xs text-purple-700 mb-3">Connect with other entrepreneurs</p>
                <Button size="sm" variant="outline" className="text-xs border-purple-200 text-purple-700 hover:bg-purple-100">
                  Join Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
