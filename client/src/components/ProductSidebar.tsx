import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Package, Tag } from "lucide-react";
import type { Category, Subcategory, Product } from "@shared/schema";

interface ProductWithCategories extends Product {
  category?: Category;
  subcategory?: Subcategory;
}

interface ProductSidebarProps {
  selectedCategoryId?: string;
  selectedSubcategoryId?: string;
  onCategorySelect?: (categoryId: string | undefined) => void;
  onSubcategorySelect?: (subcategoryId: string | undefined) => void;
}

export default function ProductSidebar({ 
  selectedCategoryId, 
  selectedSubcategoryId,
  onCategorySelect = () => {},
  onSubcategorySelect = () => {}
}: ProductSidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Fetch categories and products with categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    retry: false,
  });

  const { data: subcategories = [] } = useQuery<Subcategory[]>({
    queryKey: ["/api/subcategories"],
    retry: false,
  });

  const { data: products = [] } = useQuery<ProductWithCategories[]>({
    queryKey: ["/api/products"],
    retry: false,
  });

  // Group products by category and subcategory
  const categoryStats = categories.map(category => {
    const categoryProducts = products.filter(p => p.categoryId === category.id);
    const categorySubcategories = subcategories.filter(s => s.categoryId === category.id);
    
    const subcategoryStats = categorySubcategories.map(subcategory => ({
      ...subcategory,
      productCount: products.filter(p => p.subcategoryId === subcategory.id).length
    }));

    return {
      ...category,
      productCount: categoryProducts.length,
      subcategories: subcategoryStats
    };
  });

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleCategoryClick = (categoryId: string) => {
    const newCategoryId = selectedCategoryId === categoryId ? undefined : categoryId;
    onCategorySelect(newCategoryId);
    onSubcategorySelect(undefined); // Reset subcategory when category changes
    
    // Auto-expand category if selected
    if (newCategoryId) {
      setExpandedCategories(prev => new Set([...prev, categoryId]));
    }
  };

  const handleSubcategoryClick = (subcategoryId: string) => {
    const newSubcategoryId = selectedSubcategoryId === subcategoryId ? undefined : subcategoryId;
    onSubcategorySelect(newSubcategoryId);
  };

  return (
    <Card className="w-80 h-fit sticky top-4">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Package className="w-5 h-5" />
          Product Categories
        </CardTitle>
        <div className="text-sm text-gray-600">
          {products.length} products available
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* All Products */}
        <Button
          variant={!selectedCategoryId && !selectedSubcategoryId ? "default" : "ghost"}
          className="w-full justify-start p-3 h-auto"
          onClick={() => {
            onCategorySelect(undefined);
            onSubcategorySelect(undefined);
          }}
          data-testid="category-all"
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <span>All Products</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {products.length}
            </Badge>
          </div>
        </Button>

        {/* Categories */}
        {categoryStats.map((category) => {
          const isExpanded = expandedCategories.has(category.id);
          const isSelected = selectedCategoryId === category.id;
          
          return (
            <div key={category.id} className="space-y-1">
              <Collapsible open={isExpanded} onOpenChange={() => toggleCategory(category.id)}>
                <div className="flex items-center">
                  <Button
                    variant={isSelected ? "default" : "ghost"}
                    className="flex-1 justify-start p-3 h-auto mr-1"
                    onClick={() => handleCategoryClick(category.id)}
                    data-testid={`category-${category.id}`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm font-medium">{category.name}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {category.productCount}
                      </Badge>
                    </div>
                  </Button>
                  
                  {category.subcategories.length > 0 && (
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-8 h-8 p-0"
                        data-testid={`expand-category-${category.id}`}
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  )}
                </div>
                
                <CollapsibleContent className="space-y-1 ml-4">
                  {category.subcategories.map((subcategory) => {
                    const isSubSelected = selectedSubcategoryId === subcategory.id;
                    
                    return (
                      <Button
                        key={subcategory.id}
                        variant={isSubSelected ? "default" : "ghost"}
                        className="w-full justify-start p-2 h-auto text-sm"
                        onClick={() => handleSubcategoryClick(subcategory.id)}
                        data-testid={`subcategory-${subcategory.id}`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span>{subcategory.name}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {subcategory.productCount}
                          </Badge>
                        </div>
                      </Button>
                    );
                  })}
                </CollapsibleContent>
              </Collapsible>
            </div>
          );
        })}

        {categories.length === 0 && (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No categories available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}