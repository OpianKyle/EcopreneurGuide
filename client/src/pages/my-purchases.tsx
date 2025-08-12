import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/Sidebar";
import { Download, FileArchive, Calendar, DollarSign, Lock } from "lucide-react";
import type { Product, User } from "@shared/schema";

export default function MyPurchases() {
  const { isAuthenticated, user } = useAuth();

  // Use the new my-products endpoint that checks payment status
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/my-products"],
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
    return null;
  }

  const userHasPaid = (user as User)?.hasPaid || (user as User)?.isAdmin;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar currentPath="/my-purchases" />

      {/* Main Content */}
      <div className="flex-1 lg:pl-0 pt-16 lg:pt-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Library</h1>
            <p className="text-gray-600">
              {userHasPaid 
                ? "Download your digital products and access all available content" 
                : "Purchase any product to unlock access to our entire digital library"
              }
            </p>
          </div>

          {/* Payment Status Notice */}
          {!userHasPaid && (
            <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-2xl">
              <div className="flex items-center mb-3">
                <Lock className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-blue-800">Unlock Full Access</h3>
              </div>
              <p className="text-blue-700 mb-4">
                Purchase any product to instantly unlock access to our entire digital product library. 
                One purchase gives you everything!
              </p>
              <Button 
                onClick={() => window.location.href = "/sales"}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Browse Products
              </Button>
            </div>
          )}

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-20 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <FileArchive className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-500">${product.price}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {product.description || "No description available"}
                  </p>
                  
                  <div className="space-y-3">
                    <Button 
                      onClick={() => handleDownload(product.id, product.name)}
                      className="w-full bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : userHasPaid ? (
            <div className="text-center py-12">
              <FileArchive className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Available</h3>
              <p className="text-gray-600">Check back later for new digital products.</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <Lock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Library Locked</h3>
              <p className="text-gray-600 mb-6">Purchase any product to unlock access to all digital products.</p>
              <Button 
                onClick={() => window.location.href = "/sales"}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Browse Products
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}