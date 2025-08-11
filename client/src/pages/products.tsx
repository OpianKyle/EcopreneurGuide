import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProductSidebar from "@/components/ProductSidebar";
import type { Category, Subcategory, Product } from "@shared/schema";

interface ProductWithCategories extends Product {
  category?: Category;
  subcategory?: Subcategory;
}

export default function Products() {
  const { isAuthenticated, user, logoutMutation } = useAuth();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | undefined>();

  // Fetch products with categories
  const { data: products = [], isLoading } = useQuery<ProductWithCategories[]>({
    queryKey: ["/api/products"],
    retry: false,
  });

  // Filter products based on selected category/subcategory
  const filteredProducts = products.filter((product) => {
    if (selectedSubcategoryId) {
      return product.subcategoryId === selectedSubcategoryId;
    }
    if (selectedCategoryId) {
      return product.categoryId === selectedCategoryId;
    }
    return true; // Show all products if no filter selected
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Please Login</h2>
              <p className="text-gray-600 mb-4">Access required to view products</p>
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
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="text-2xl font-bold text-blue-600">DigitalPro</div>
              <div className="flex space-x-4">
                <Button asChild variant="ghost">
                  <a href="/dashboard">Dashboard</a>
                </Button>
                <Button asChild variant="ghost" className="bg-blue-50">
                  <a href="/products">Products</a>
                </Button>
                {user?.isAdmin && (
                  <Button asChild variant="ghost">
                    <a href="/admin">Admin</a>
                  </Button>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.firstName || user?.email}</span>
              <Button 
                variant="outline" 
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
        <div className="flex gap-8">
          {/* Sidebar */}
          <ProductSidebar
            selectedCategoryId={selectedCategoryId}
            selectedSubcategoryId={selectedSubcategoryId}
            onCategorySelect={setSelectedCategoryId}
            onSubcategorySelect={setSelectedSubcategoryId}
          />

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Digital Products</h1>
              <p className="text-gray-600">Browse our collection of digital products with Master Resell Rights</p>
              
              {/* Filter breadcrumb */}
              {(selectedCategoryId || selectedSubcategoryId) && (
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-sm text-gray-500">Filtered by:</span>
                  <div className="flex gap-2">
                    {selectedCategoryId && (
                      <Badge variant="outline" className="gap-1">
                        Category: {products.find(p => p.categoryId === selectedCategoryId)?.category?.name}
                        <button
                          onClick={() => {
                            setSelectedCategoryId(undefined);
                            setSelectedSubcategoryId(undefined);
                          }}
                          className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                        >
                          ×
                        </button>
                      </Badge>
                    )}
                    {selectedSubcategoryId && (
                      <Badge variant="outline" className="gap-1">
                        Subcategory: {products.find(p => p.subcategoryId === selectedSubcategoryId)?.subcategory?.name}
                        <button
                          onClick={() => setSelectedSubcategoryId(undefined)}
                          className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                        >
                          ×
                        </button>
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-20 bg-gray-200 rounded mb-4"></div>
                      <div className="flex justify-between items-center">
                        <div className="h-8 bg-gray-200 rounded w-20"></div>
                        <div className="h-8 bg-gray-200 rounded w-24"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <div className="flex flex-wrap gap-2">
                        {product.category && (
                          <Badge variant="secondary" className="text-xs">
                            {product.category.name}
                          </Badge>
                        )}
                        {product.subcategory && (
                          <Badge variant="outline" className="text-xs">
                            {product.subcategory.name}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {product.description || "High-quality digital product with Master Resell Rights included."}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-green-600">
                          ${product.price}
                        </span>
                        <Button 
                          className="bg-green-600 hover:bg-green-700"
                          data-testid={`button-buy-${product.id}`}
                        >
                          Buy Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-12 h-12 bg-gray-400 rounded"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {selectedCategoryId || selectedSubcategoryId ? "No Products Found" : "No Products Available"}
                </h3>
                <p className="text-gray-600 mb-4">
                  {selectedCategoryId || selectedSubcategoryId 
                    ? "Try selecting a different category or clearing your filters"
                    : "Products will appear here once they are added"
                  }
                </p>
                {(selectedCategoryId || selectedSubcategoryId) && (
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSelectedCategoryId(undefined);
                      setSelectedSubcategoryId(undefined);
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}