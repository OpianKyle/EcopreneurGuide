import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Category, Subcategory, Product } from "@shared/schema";

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  downloadUrl: string;
  categoryId: string;
  subcategoryId: string;
}

interface UploadedFileInfo {
  filename: string;
  originalName: string;
  size: number;
}

export default function AdminProducts() {
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    downloadUrl: "",
    categoryId: "",
    subcategoryId: "",
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileInfo, setUploadedFileInfo] = useState<UploadedFileInfo | null>(null);

  // Fetch data
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    retry: false,
    enabled: isAuthenticated && user?.isAdmin,
  });

  const { data: subcategories = [] } = useQuery<Subcategory[]>({
    queryKey: ["/api/subcategories"],
    retry: false,
    enabled: isAuthenticated && user?.isAdmin,
  });

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    retry: false,
    enabled: isAuthenticated && user?.isAdmin,
  });

  // Filter subcategories by selected category
  const filteredSubcategories = subcategories.filter(
    sub => sub.categoryId === formData.categoryId
  );

  // File upload mutation
  const fileUploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
      
      return response.json();
    },
  });

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/products", {
        ...data,
        price: data.price,
        categoryId: data.categoryId || null,
        subcategoryId: data.subcategoryId || null,
        fileName: uploadedFileInfo?.filename || null,
        fileSize: uploadedFileInfo?.size || null,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product created successfully!",
      });
      setIsCreateDialogOpen(false);
      setFormData({
        name: "",
        description: "",
        price: "",
        downloadUrl: "",
        categoryId: "",
        subcategoryId: "",
      });
      setUploadedFile(null);
      setUploadedFileInfo(null);
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create product",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.zip')) {
      toast({
        title: "Error",
        description: "Only ZIP files are allowed",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const result = await fileUploadMutation.mutateAsync(file);
      setUploadedFileInfo(result);
      toast({
        title: "Success",
        description: "File uploaded successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload file",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.categoryId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Upload file first if one is selected
    if (uploadedFile && !uploadedFileInfo) {
      await handleFileUpload(uploadedFile);
    }
    
    createProductMutation.mutate(formData);
  };

  // Reset subcategory when category changes
  useEffect(() => {
    if (formData.categoryId) {
      setFormData(prev => ({ ...prev, subcategoryId: "" }));
    }
  }, [formData.categoryId]);

  if (!isAuthenticated || !user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
              <p className="text-gray-600 mb-4">Admin access required.</p>
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
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="text-2xl font-bold text-blue-600">DigitalPro</div>
              <div className="flex space-x-4">
                <Button asChild variant="ghost">
                  <a href="/admin">Dashboard</a>
                </Button>
                <Button asChild variant="ghost" className="bg-blue-50">
                  <a href="/admin/products">Products</a>
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Admin Panel</span>
              <Button asChild variant="outline">
                <a href="/dashboard">Exit Admin</a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
            <p className="text-gray-600">Create and manage digital products with categories</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-green-600 hover:bg-green-700"
                data-testid="button-create-product"
              >
                Create Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Product</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter product name"
                      data-testid="input-product-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="0.00"
                      data-testid="input-product-price"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter product description"
                    rows={3}
                    data-testid="textarea-product-description"
                  />
                </div>

                <div>
                  <Label htmlFor="downloadUrl">Download URL</Label>
                  <Input
                    id="downloadUrl"
                    value={formData.downloadUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, downloadUrl: e.target.value }))}
                    placeholder="https://example.com/download-link"
                    data-testid="input-download-url"
                  />
                </div>

                <div>
                  <Label htmlFor="file">Product ZIP File</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".zip"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setUploadedFile(file);
                        setUploadedFileInfo(null);
                      }
                    }}
                    data-testid="input-product-file"
                  />
                  {uploadedFile && (
                    <div className="mt-2 p-2 bg-blue-50 rounded">
                      <p className="text-sm text-blue-800">
                        Selected: {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    </div>
                  )}
                  {uploadedFileInfo && (
                    <div className="mt-2 p-2 bg-green-50 rounded">
                      <p className="text-sm text-green-800">
                        ✓ File uploaded: {uploadedFileInfo.originalName} ({(uploadedFileInfo.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    </div>
                  )}
                  {fileUploadMutation.isPending && (
                    <div className="mt-2 p-2 bg-yellow-50 rounded">
                      <p className="text-sm text-yellow-800">Uploading file...</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.categoryId}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
                    >
                      <SelectTrigger data-testid="select-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="subcategory">Subcategory</Label>
                    <Select
                      value={formData.subcategoryId}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, subcategoryId: value }))}
                      disabled={!formData.categoryId}
                    >
                      <SelectTrigger data-testid="select-subcategory">
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredSubcategories.map((subcategory) => (
                          <SelectItem key={subcategory.id} value={subcategory.id}>
                            {subcategory.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createProductMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                    data-testid="button-submit-product"
                  >
                    {createProductMutation.isPending ? "Creating..." : "Create Product"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <div className="flex flex-wrap gap-2">
                  {(product as any).category && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {(product as any).category.name}
                    </span>
                  )}
                  {(product as any).subcategory && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {(product as any).subcategory.name}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {product.description || "No description available"}
                </p>
                {(product as any).fileName && (
                  <div className="mb-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
                    📁 File: {(product as any).fileName}
                    {(product as any).fileSize && (
                      <span> ({((product as any).fileSize / 1024 / 1024).toFixed(2)} MB)</span>
                    )}
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-600">
                    ${product.price}
                  </span>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-12 h-12 bg-gray-400 rounded"></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Products Yet</h3>
            <p className="text-gray-600 mb-4">Create your first digital product to get started</p>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              Create First Product
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}