import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Order, Download, User } from "@shared/schema";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
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
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-brand-blue">
                <i className="fas fa-rocket mr-2"></i>DigitalPro
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {(user as User)?.firstName || "User"}!</span>
              <Button asChild variant="outline" className="text-gray-700 border-gray-300 hover:bg-gray-100">
                <a href="/api/logout">Logout</a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back, {(user as User)?.firstName || "User"}! 👋</h1>
          <p className="text-gray-600">Manage your digital products and track your progress</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Products Owned</p>
                  <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
                </div>
                <div className="w-12 h-12 bg-brand-blue rounded-lg flex items-center justify-center">
                  <i className="fas fa-box text-white"></i>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Downloads</p>
                  <p className="text-2xl font-bold text-gray-800">{downloads.length}</p>
                </div>
                <div className="w-12 h-12 bg-brand-green rounded-lg flex items-center justify-center">
                  <i className="fas fa-download text-white"></i>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Resell Earnings</p>
                  <p className="text-2xl font-bold text-gray-800">$0</p>
                </div>
                <div className="w-12 h-12 bg-brand-orange rounded-lg flex items-center justify-center">
                  <i className="fas fa-dollar-sign text-white"></i>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Support Tickets</p>
                  <p className="text-2xl font-bold text-gray-800">0</p>
                </div>
                <div className="w-12 h-12 bg-brand-red rounded-lg flex items-center justify-center">
                  <i className="fas fa-ticket-alt text-white"></i>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Products */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>My Products</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-brand-blue rounded-lg flex items-center justify-center">
                        <i className="fas fa-play text-white"></i>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {order.productId === "digital-series" ? "Digital Product Series - Master Resell Rights" : "Complete Business System"}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Purchased: {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button className="bg-brand-blue text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                        <i className="fas fa-download mr-1"></i>Download
                      </Button>
                      <Button className="bg-brand-green text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors">
                        <i className="fas fa-share mr-1"></i>Resell
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-box text-gray-400 text-2xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Products Yet</h3>
                <p className="text-gray-600 mb-4">You haven't purchased any products yet.</p>
                <Button asChild className="bg-brand-blue hover:bg-blue-700">
                  <a href="/sales">Browse Products</a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Downloads</CardTitle>
            </CardHeader>
            <CardContent>
              {downloads.length > 0 ? (
                <div className="space-y-3">
                  {downloads.slice(0, 5).map((download) => (
                    <div key={download.id} className="flex items-center justify-between text-sm">
                      <span>Product Download</span>
                      <span className="text-gray-500">{new Date(download.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No downloads yet</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Support</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full bg-brand-blue text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  <i className="fas fa-plus mr-2"></i>Create Support Ticket
                </Button>
                <Button variant="outline" className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                  <i className="fas fa-book mr-2"></i>Knowledge Base
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
