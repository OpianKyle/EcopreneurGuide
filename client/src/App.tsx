import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing.tsx";
import Sales from "@/pages/sales.tsx";
import Upsell from "@/pages/upsell.tsx";
import Dashboard from "@/pages/dashboard";
import Admin from "@/pages/admin";
import AdminProducts from "@/pages/admin-products";
import Products from "@/pages/products";
import Checkout from "@/pages/checkout.tsx";
import Home from "@/pages/home.tsx";
import Auth from "@/pages/auth";

function Router() {
  const { user, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading ? (
        <Route path="*">
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </Route>
      ) : user ? (
        <>
          <Route path="/" component={Home} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/products" component={Products} />
          <Route path="/admin" component={Admin} />
          <Route path="/admin/products" component={AdminProducts} />
          <Route path="/sales" component={Sales} />
          <Route path="/upsell" component={Upsell} />
          <Route path="/checkout" component={Checkout} />
        </>
      ) : (
        <>
          <Route path="/" component={Landing} />
          <Route path="/auth" component={Auth} />
          <Route path="/sales" component={Sales} />
          <Route path="/upsell" component={Upsell} />
          <Route path="/checkout" component={Checkout} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
