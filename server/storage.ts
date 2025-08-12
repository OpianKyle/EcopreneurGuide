import {
  users,
  categories,
  subcategories,
  products,
  orders,
  leads,
  supportTickets,
  emailCampaigns,
  downloads,
  type User,
  type UpsertUser,
  type Category,
  type InsertCategory,
  type Subcategory,
  type InsertSubcategory,
  type Product,
  type InsertProduct,
  type Order,
  type InsertOrder,
  type Lead,
  type InsertLead,
  type SupportTicket,
  type InsertSupportTicket,
  type EmailCampaign,
  type InsertEmailCampaign,
  type Download,
  type InsertDownload,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, count, sum, and } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  getUserByGithubId(githubId: string): Promise<User | undefined>;
  createUser(userData: Partial<UpsertUser>): Promise<User>;
  updateUser(id: string, userData: Partial<UpsertUser>): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserStripeInfo(userId: string, customerId: string, subscriptionId?: string): Promise<User>;
  markUserAsPaid(userId: string): Promise<User>;
  getUserProducts(userId: string): Promise<Product[]>;

  // Category operations
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category>;

  // Subcategory operations
  getSubcategories(): Promise<Subcategory[]>;
  getSubcategoriesByCategory(categoryId: string): Promise<Subcategory[]>;
  getSubcategory(id: string): Promise<Subcategory | undefined>;
  createSubcategory(subcategory: InsertSubcategory): Promise<Subcategory>;
  updateSubcategory(id: string, subcategory: Partial<InsertSubcategory>): Promise<Subcategory>;

  // Product operations
  getProducts(): Promise<Product[]>;
  getProductsWithCategories(): Promise<(Product & { category?: Category; subcategory?: Subcategory })[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product>;

  // Order operations
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: string): Promise<Order | undefined>;
  getOrdersByUser(userId: string): Promise<Order[]>;
  getAllOrders(): Promise<Order[]>;
  updateOrderStatus(id: string, status: string): Promise<Order>;
  getUserProductOrder(userId: string, productId: string): Promise<Order | undefined>;

  // Lead operations
  createLead(lead: InsertLead): Promise<Lead>;
  getLeads(): Promise<Lead[]>;
  convertLead(email: string): Promise<void>;

  // Support ticket operations
  createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket>;
  getSupportTickets(): Promise<SupportTicket[]>;
  getSupportTicketsByUser(userId: string): Promise<SupportTicket[]>;
  updateSupportTicketStatus(id: string, status: string): Promise<SupportTicket>;

  // Email campaign operations
  createEmailCampaign(campaign: InsertEmailCampaign): Promise<EmailCampaign>;
  getEmailCampaigns(): Promise<EmailCampaign[]>;
  updateEmailCampaignStats(id: string, stats: { sentCount?: number; openCount?: number; clickCount?: number }): Promise<EmailCampaign>;

  // Download operations
  createDownload(download: InsertDownload): Promise<Download>;
  getDownloadsByUser(userId: string): Promise<Download[]>;

  // Analytics
  getAdminStats(): Promise<{
    totalSales: number;
    totalCustomers: number;
    totalLeads: number;
    totalOrders: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.googleId, googleId));
    return user;
  }

  async getUserByGithubId(githubId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.githubId, githubId));
    return user;
  }

  async createUser(userData: Partial<UpsertUser>): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData as any)
      .returning();
    return user;
  }

  async updateUser(id: string, userData: Partial<UpsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserStripeInfo(userId: string, customerId: string, subscriptionId?: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        hasPaid: true, // Mark user as paid when Stripe info is updated
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async markUserAsPaid(userId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ hasPaid: true, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async getUserProducts(userId: string): Promise<Product[]> {
    // Get user to check if they have paid
    const user = await this.getUser(userId);
    if (!user) {
      return [];
    }

    // If user has paid, return all products; otherwise return empty array
    if (user.hasPaid || user.isAdmin) {
      return await this.getProducts();
    }

    return [];
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).where(eq(categories.isActive, true)).orderBy(categories.name);
  }

  async getCategory(id: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  async updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category> {
    const [updatedCategory] = await db
      .update(categories)
      .set({ ...category, updatedAt: new Date() })
      .where(eq(categories.id, id))
      .returning();
    return updatedCategory;
  }

  // Subcategory operations
  async getSubcategories(): Promise<Subcategory[]> {
    return await db.select().from(subcategories).where(eq(subcategories.isActive, true)).orderBy(subcategories.name);
  }

  async getSubcategoriesByCategory(categoryId: string): Promise<Subcategory[]> {
    return await db
      .select()
      .from(subcategories)
      .where(and(eq(subcategories.categoryId, categoryId), eq(subcategories.isActive, true)))
      .orderBy(subcategories.name);
  }

  async getSubcategory(id: string): Promise<Subcategory | undefined> {
    const [subcategory] = await db.select().from(subcategories).where(eq(subcategories.id, id));
    return subcategory;
  }

  async createSubcategory(subcategory: InsertSubcategory): Promise<Subcategory> {
    const [newSubcategory] = await db.insert(subcategories).values(subcategory).returning();
    return newSubcategory;
  }

  async updateSubcategory(id: string, subcategory: Partial<InsertSubcategory>): Promise<Subcategory> {
    const [updatedSubcategory] = await db
      .update(subcategories)
      .set({ ...subcategory, updatedAt: new Date() })
      .where(eq(subcategories.id, id))
      .returning();
    return updatedSubcategory;
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.isActive, true)).orderBy(desc(products.createdAt));
  }

  async getProductsWithCategories(): Promise<(Product & { category?: Category; subcategory?: Subcategory })[]> {
    const result = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        price: products.price,
        downloadUrl: products.downloadUrl,
        categoryId: products.categoryId,
        subcategoryId: products.subcategoryId,
        isActive: products.isActive,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        category: {
          id: categories.id,
          name: categories.name,
          description: categories.description,
        },
        subcategory: {
          id: subcategories.id,
          name: subcategories.name,
          description: subcategories.description,
        },
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(subcategories, eq(products.subcategoryId, subcategories.id))
      .where(eq(products.isActive, true))
      .orderBy(desc(products.createdAt));

    return result as any;
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const productData = {
      ...product,
      price: product.price.toString(),
    };
    const [newProduct] = await db.insert(products).values(productData as any).returning();
    return newProduct;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product> {
    const updateData = {
      ...product,
      updatedAt: new Date(),
    };
    
    // Convert price to string if it exists
    if (updateData.price !== undefined) {
      updateData.price = updateData.price.toString() as any;
    }
    
    const [updatedProduct] = await db
      .update(products)
      .set(updateData as any)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  // Order operations
  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
  }

  async getAllOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  async getUserProductOrder(userId: string, productId: string): Promise<Order | undefined> {
    const [order] = await db
      .select()
      .from(orders)
      .where(and(eq(orders.userId, userId), eq(orders.productId, productId)))
      .orderBy(desc(orders.createdAt));
    return order;
  }

  // Lead operations
  async createLead(lead: InsertLead): Promise<Lead> {
    const [newLead] = await db.insert(leads).values(lead).returning();
    return newLead;
  }

  async getLeads(): Promise<Lead[]> {
    return await db.select().from(leads).orderBy(desc(leads.createdAt));
  }

  async convertLead(email: string): Promise<void> {
    await db.update(leads).set({ isConverted: true }).where(eq(leads.email, email));
  }

  // Support ticket operations
  async createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket> {
    const [newTicket] = await db.insert(supportTickets).values(ticket).returning();
    return newTicket;
  }

  async getSupportTickets(): Promise<SupportTicket[]> {
    return await db.select().from(supportTickets).orderBy(desc(supportTickets.createdAt));
  }

  async getSupportTicketsByUser(userId: string): Promise<SupportTicket[]> {
    return await db.select().from(supportTickets).where(eq(supportTickets.userId, userId)).orderBy(desc(supportTickets.createdAt));
  }

  async updateSupportTicketStatus(id: string, status: string): Promise<SupportTicket> {
    const [updatedTicket] = await db
      .update(supportTickets)
      .set({ status, updatedAt: new Date() })
      .where(eq(supportTickets.id, id))
      .returning();
    return updatedTicket;
  }

  // Email campaign operations
  async createEmailCampaign(campaign: InsertEmailCampaign): Promise<EmailCampaign> {
    const [newCampaign] = await db.insert(emailCampaigns).values(campaign).returning();
    return newCampaign;
  }

  async getEmailCampaigns(): Promise<EmailCampaign[]> {
    return await db.select().from(emailCampaigns).orderBy(desc(emailCampaigns.createdAt));
  }

  async updateEmailCampaignStats(
    id: string,
    stats: { sentCount?: number; openCount?: number; clickCount?: number }
  ): Promise<EmailCampaign> {
    const [updatedCampaign] = await db
      .update(emailCampaigns)
      .set(stats)
      .where(eq(emailCampaigns.id, id))
      .returning();
    return updatedCampaign;
  }

  // Download operations
  async createDownload(download: InsertDownload): Promise<Download> {
    const [newDownload] = await db.insert(downloads).values(download).returning();
    return newDownload;
  }

  async getDownloadsByUser(userId: string): Promise<Download[]> {
    return await db.select().from(downloads).where(eq(downloads.userId, userId)).orderBy(desc(downloads.createdAt));
  }

  // Analytics
  async getAdminStats(): Promise<{
    totalSales: number;
    totalCustomers: number;
    totalLeads: number;
    totalOrders: number;
  }> {
    const [salesResult] = await db
      .select({ total: sum(orders.amount) })
      .from(orders)
      .where(eq(orders.status, "completed"));

    const [customersResult] = await db.select({ count: count() }).from(users);
    const [leadsResult] = await db.select({ count: count() }).from(leads);
    const [ordersResult] = await db.select({ count: count() }).from(orders);

    return {
      totalSales: Number(salesResult?.total || 0),
      totalCustomers: customersResult?.count || 0,
      totalLeads: leadsResult?.count || 0,
      totalOrders: ordersResult?.count || 0,
    };
  }
}

export const storage = new DatabaseStorage();
