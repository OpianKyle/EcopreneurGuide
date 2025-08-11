import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertLeadSchema, insertSupportTicketSchema, insertProductSchema } from "@shared/schema";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-07-30.basil",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

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

  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching products: " + error.message });
    }
  });

  app.post("/api/products", isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
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
  app.post("/api/orders", isAuthenticated, async (req: any, res) => {
    try {
      const { productId, amount, paymentIntentId } = req.body;
      const userId = req.user.claims.sub;

      const order = await storage.createOrder({
        userId,
        productId,
        amount: amount.toString(),
        status: "completed",
        stripePaymentIntentId: paymentIntentId,
      });

      // Convert lead if they signed up from email
      const user = await storage.getUser(userId);
      if (user?.email) {
        await storage.convertLead(user.email);
      }

      res.json(order);
    } catch (error: any) {
      res.status(400).json({ message: "Error creating order: " + error.message });
    }
  });

  // User orders
  app.get("/api/my-orders", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const orders = await storage.getOrdersByUser(userId);
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching orders: " + error.message });
    }
  });

  // User downloads
  app.get("/api/my-downloads", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const downloads = await storage.getDownloadsByUser(userId);
      res.json(downloads);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching downloads: " + error.message });
    }
  });

  // Support tickets
  app.post("/api/support-tickets", isAuthenticated, async (req: any, res) => {
    try {
      const ticketData = insertSupportTicketSchema.parse({
        ...req.body,
        userId: req.user.claims.sub,
      });
      const ticket = await storage.createSupportTicket(ticketData);
      res.json(ticket);
    } catch (error: any) {
      res.status(400).json({ message: "Error creating support ticket: " + error.message });
    }
  });

  app.get("/api/my-support-tickets", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const tickets = await storage.getSupportTicketsByUser(userId);
      res.json(tickets);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching support tickets: " + error.message });
    }
  });

  // Admin routes
  app.get("/api/admin/stats", isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching admin stats: " + error.message });
    }
  });

  app.get("/api/admin/orders", isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching orders: " + error.message });
    }
  });

  app.get("/api/admin/leads", isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const leads = await storage.getLeads();
      res.json(leads);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching leads: " + error.message });
    }
  });

  app.get("/api/admin/support-tickets", isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const tickets = await storage.getSupportTickets();
      res.json(tickets);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching support tickets: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
