import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Order, Lead, User } from "@shared/schema";

export default function Admin() {
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
        window.location.href = "/auth";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  interface AdminStats {
    totalSales: number;
    totalCustomers: number;
    totalLeads: number;
    totalOrders: number;
  }

  const { data: stats } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
    retry: false,
    enabled: isAuthenticated && (user as User)?.isAdmin,
  });

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["/api/admin/orders"],
    retry: false,
    enabled: isAuthenticated && (user as User)?.isAdmin,
  });

  const { data: leads = [] } = useQuery<Lead[]>({
    queryKey: ["/api/admin/leads"],
    retry: false,
    enabled: isAuthenticated && (user as User)?.isAdmin,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated || !(user as User)?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-red rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-shield-alt text-white text-2xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
              <p className="text-gray-600 mb-4">This page requires admin privileges.</p>
              <Button asChild className="bg-brand-blue hover:bg-blue-700">
                <a href="/dashboard">Go to Dashboard</a>
              </Button>
            </div>
          </CardContent>
        </Card>
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
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Admin Panel</span>
              <Button asChild variant="outline" className="text-gray-700 border-gray-300 hover:bg-gray-100">
                <a href="/api/logout">Logout</a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard 🔧</h1>
          <p className="text-gray-600">Manage your sales funnel, customers, and analytics</p>
        </div>

        {/* Admin Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Sales</p>
                  <p className="text-2xl font-bold text-gray-800">${stats?.totalSales || 0}</p>
                </div>
                <div className="w-12 h-12 bg-brand-green rounded-lg flex items-center justify-center">
                  <i className="fas fa-chart-line text-white"></i>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-green-600 text-sm">Live data</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Customers</p>
                  <p className="text-2xl font-bold text-gray-800">{stats?.totalCustomers || 0}</p>
                </div>
                <div className="w-12 h-12 bg-brand-blue rounded-lg flex items-center justify-center">
                  <i className="fas fa-users text-white"></i>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-blue-600 text-sm">Total registered</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Orders</p>
                  <p className="text-2xl font-bold text-gray-800">{stats?.totalOrders || 0}</p>
                </div>
                <div className="w-12 h-12 bg-brand-orange rounded-lg flex items-center justify-center">
                  <i className="fas fa-shopping-cart text-white"></i>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-orange-600 text-sm">All time</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Leads</p>
                  <p className="text-2xl font-bold text-gray-800">{stats?.totalLeads || 0}</p>
                </div>
                <div className="w-12 h-12 bg-brand-red rounded-lg flex items-center justify-center">
                  <i className="fas fa-user-plus text-white"></i>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-red-600 text-sm">Email captured</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <Button className="bg-brand-blue text-white p-4 rounded-lg hover:bg-blue-700 transition-colors h-auto flex-col">
                <i className="fas fa-plus mb-2 text-xl"></i>
                <div className="text-sm font-medium">Add Product</div>
              </Button>
              <Button className="bg-brand-green text-white p-4 rounded-lg hover:bg-green-700 transition-colors h-auto flex-col">
                <i className="fas fa-shopping-cart mb-2 text-xl"></i>
                <div className="text-sm font-medium">View Orders</div>
              </Button>
              <Button className="bg-brand-orange text-white p-4 rounded-lg hover:bg-orange-600 transition-colors h-auto flex-col">
                <i className="fas fa-envelope mb-2 text-xl"></i>
                <div className="text-sm font-medium">Email Campaigns</div>
              </Button>
              <Button className="bg-brand-red text-white p-4 rounded-lg hover:bg-red-700 transition-colors h-auto flex-col">
                <i className="fas fa-chart-bar mb-2 text-xl"></i>
                <div className="text-sm font-medium">Analytics</div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders and Leads */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">Order #{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-gray-600">${order.amount}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-green-600 font-medium capitalize">{order.status}</p>
                        <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No orders yet</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Leads</CardTitle>
            </CardHeader>
            <CardContent>
              {leads.length > 0 ? (
                <div className="space-y-4">
                  {leads.slice(0, 5).map((lead) => (
                    <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{lead.firstName}</p>
                        <p className="text-sm text-gray-600">{lead.email}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${lead.isConverted ? "text-green-600" : "text-gray-600"}`}>
                          {lead.isConverted ? "Converted" : "Active"}
                        </p>
                        <p className="text-xs text-gray-500">{new Date(lead.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No leads yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
