import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileArchive, Calendar, DollarSign } from "lucide-react";
import type { Order, Product } from "@shared/schema";

interface OrderWithProduct extends Order {
  product: Product;
}

export default function MyPurchases() {
  const { isAuthenticated, user } = useAuth();

  const { data: orders = [], isLoading } = useQuery<OrderWithProduct[]>({
    queryKey: ["/api/my-orders"],
    enabled: isAuthenticated,
  });

  const handleDownload = async (productId: string, productName: string) => {
    try {
      const response = await fetch(`/api/download/${productId}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${productName}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed. Please contact support.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Login Required</h2>
              <p className="text-gray-600 mb-4">Please login to view your purchases.</p>
              <Button asChild>
                <a href="/auth">Login</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Purchases</h1>
          <p className="text-gray-600">Download your digital products and manage your purchases</p>
        </div>

        {/* Orders Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : orders.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileArchive className="w-5 h-5 text-blue-600" />
                    {order.product.name}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      ${order.amount}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {order.product.description || "No description available"}
                  </p>
                  
                  <div className="space-y-3">
                    {/* Order Status */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>

                    {/* Download Button */}
                    {order.status === 'completed' && order.product.fileName && (
                      <Button 
                        onClick={() => handleDownload(order.product.id, order.product.name)}
                        className="w-full bg-green-600 hover:bg-green-700"
                        data-testid={`button-download-${order.product.id}`}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Product
                      </Button>
                    )}

                    {/* File Info */}
                    {order.product.fileName && (
                      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                        📁 {order.product.fileName}
                        {(order.product as any).fileSize && (
                          <span> ({((order.product as any).fileSize / 1024 / 1024).toFixed(2)} MB)</span>
                        )}
                      </div>
                    )}

                    {/* Master Resell Rights Notice */}
                    <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                      ✓ Includes Master Resell Rights - You can resell this product!
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileArchive className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Purchases Yet</h3>
            <p className="text-gray-600 mb-4">Start building your digital product library today</p>
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <a href="/products">Browse Products</a>
            </Button>
          </div>
        )}

        {/* Support Section */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Need Help?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Download Issues</h3>
              <p className="text-sm text-gray-600 mb-3">
                If you're having trouble downloading your products, try refreshing the page or contact our support team.
              </p>
              <Button variant="outline" size="sm">
                Contact Support
              </Button>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Master Resell Rights</h3>
              <p className="text-sm text-gray-600 mb-3">
                All products include Master Resell Rights, meaning you can resell them and keep 100% of the profits.
              </p>
              <Button variant="outline" size="sm">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}