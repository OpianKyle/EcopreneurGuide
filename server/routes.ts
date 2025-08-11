import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { setupAuth, requireAuth, requireAdmin } from "./auth";
import { insertLeadSchema, insertSupportTicketSchema, insertProductSchema, insertCategorySchema, insertSubcategorySchema } from "@shared/schema";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-07-30.basil",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  setupAuth(app);

  // Lead capture
  app.post("/api/leads", async (req, res) => {
    try {
      const leadData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(leadData);
      res.json(lead);
    } catch (error: any) {
      res.status(400).json({ message: "Error creating lead: " + error.message });
    }
  });

  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching categories: " + error.message });
    }
  });

  app.post("/api/categories", requireAdmin, async (req: any, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.json(category);
    } catch (error: any) {
      res.status(400).json({ message: "Error creating category: " + error.message });
    }
  });

  // Subcategories
  app.get("/api/subcategories", async (req, res) => {
    try {
      const subcategories = await storage.getSubcategories();
      res.json(subcategories);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching subcategories: " + error.message });
    }
  });

  app.get("/api/subcategories/category/:categoryId", async (req, res) => {
    try {
      const { categoryId } = req.params;
      const subcategories = await storage.getSubcategoriesByCategory(categoryId);
      res.json(subcategories);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching subcategories: " + error.message });
    }
  });

  app.post("/api/subcategories", requireAdmin, async (req: any, res) => {
    try {
      const subcategoryData = insertSubcategorySchema.parse(req.body);
      const subcategory = await storage.createSubcategory(subcategoryData);
      res.json(subcategory);
    } catch (error: any) {
      res.status(400).json({ message: "Error creating subcategory: " + error.message });
    }
  });

  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProductsWithCategories();
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching products: " + error.message });
    }
  });

  app.post("/api/products", requireAdmin, async (req: any, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ message: "Error creating product: " + error.message });
    }
  });

  // Payment processing
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, productId } = req.body;
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          productId: productId || "",
        },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Order creation after successful payment
  app.post("/api/orders", requireAuth, async (req: any, res) => {
    try {
      const { productId, amount, paymentIntentId } = req.body;
      const userId = req.user.id;

      const order = await storage.createOrder({
        userId,
        productId,
        amount: amount.toString(),
        status: "completed",
        stripePaymentIntentId: paymentIntentId,
      });

      // Convert lead if they signed up from email
      if (req.user.email) {
        await storage.convertLead(req.user.email);
      }

      res.json(order);
    } catch (error: any) {
      res.status(400).json({ message: "Error creating order: " + error.message });
    }
  });

  // User orders
  app.get("/api/my-orders", requireAuth, async (req: any, res) => {
    try {
      const orders = await storage.getOrdersByUser(req.user.id);
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching orders: " + error.message });
    }
  });

  // User downloads
  app.get("/api/my-downloads", requireAuth, async (req: any, res) => {
    try {
      const downloads = await storage.getDownloadsByUser(req.user.id);
      res.json(downloads);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching downloads: " + error.message });
    }
  });

  // Support tickets
  app.post("/api/support-tickets", requireAuth, async (req: any, res) => {
    try {
      const ticketData = insertSupportTicketSchema.parse({
        ...req.body,
        userId: req.user.id,
      });
      const ticket = await storage.createSupportTicket(ticketData);
      res.json(ticket);
    } catch (error: any) {
      res.status(400).json({ message: "Error creating support ticket: " + error.message });
    }
  });

  app.get("/api/my-support-tickets", requireAuth, async (req: any, res) => {
    try {
      const tickets = await storage.getSupportTicketsByUser(req.user.id);
      res.json(tickets);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching support tickets: " + error.message });
    }
  });

  // Admin routes
  app.get("/api/admin/stats", requireAdmin, async (req: any, res) => {
    try {
      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching admin stats: " + error.message });
    }
  });

  app.get("/api/admin/orders", requireAdmin, async (req: any, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching orders: " + error.message });
    }
  });

  app.get("/api/admin/leads", requireAdmin, async (req: any, res) => {
    try {
      const leads = await storage.getLeads();
      res.json(leads);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching leads: " + error.message });
    }
  });

  app.get("/api/admin/support-tickets", requireAdmin, async (req: any, res) => {
    try {
      const tickets = await storage.getSupportTickets();
      res.json(tickets);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching support tickets: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
