import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import type { User } from "@shared/schema";
import connectPg from "connect-pg-simple";

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      firstName?: string | null;
      lastName?: string | null;
      profileImageUrl?: string | null;
      isAdmin?: boolean;
      isVerified?: boolean;
    }
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  // Session configuration
  const PostgresSessionStore = connectPg(session);
  const sessionStore = new PostgresSessionStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
  });

  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "your-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Local Strategy
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await storage.getUserByEmail(email);
          if (!user || !user.password) {
            return done(null, false, { message: "Invalid email or password" });
          }
          
          const isValid = await comparePasswords(password, user.password);
          if (!isValid) {
            return done(null, false, { message: "Invalid email or password" });
          }
          
          return done(null, {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            profileImageUrl: user.profileImageUrl,
            isAdmin: user.isAdmin || false,
            isVerified: user.isVerified || false
          } as Express.User);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // OAuth disabled for initial setup
  if (false) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: "/api/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            let user = await storage.getUserByGoogleId(profile.id);
            
            if (!user) {
              // Check if user exists with same email
              const existingUser = await storage.getUserByEmail(profile.emails?.[0]?.value || "");
              if (existingUser) {
                // Link Google account to existing user
                user = await storage.updateUser(existingUser.id, {
                  googleId: profile.id,
                  profileImageUrl: profile.photos?.[0]?.value,
                });
              } else {
                // Create new user
                user = await storage.createUser({
                  email: profile.emails?.[0]?.value || "",
                  firstName: profile.name?.givenName || "",
                  lastName: profile.name?.familyName || "",
                  profileImageUrl: profile.photos?.[0]?.value || "",
                  googleId: profile.id,
                  isVerified: true,
                });
              }
            }
            
            return done(null, {
              id: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              profileImageUrl: user.profileImageUrl,
              isAdmin: user.isAdmin || false,
              isVerified: user.isVerified || false
            } as Express.User);
          } catch (error) {
            return done(error);
          }
        }
      )
    );
  }

  // GitHub OAuth disabled for initial setup
  if (false) {
    passport.use(
      new GitHubStrategy(
        {
          clientID: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
          callbackURL: "/api/auth/github/callback",
        },
        async (accessToken: string, refreshToken: string, profile: any, done: any) => {
          try {
            let user = await storage.getUserByGithubId(profile.id);
            
            if (!user) {
              // Check if user exists with same email
              const existingUser = await storage.getUserByEmail(profile.emails?.[0]?.value || "");
              if (existingUser) {
                // Link GitHub account to existing user
                user = await storage.updateUser(existingUser.id, {
                  githubId: profile.id,
                  profileImageUrl: profile.photos?.[0]?.value,
                });
              } else {
                // Create new user
                user = await storage.createUser({
                  email: profile.emails?.[0]?.value || "",
                  firstName: profile.displayName?.split(" ")[0] || "",
                  lastName: profile.displayName?.split(" ").slice(1).join(" ") || "",
                  profileImageUrl: profile.photos?.[0]?.value || "",
                  githubId: profile.id,
                  isVerified: true,
                });
              }
            }
            
            return done(null, {
              id: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              profileImageUrl: user.profileImageUrl,
              isAdmin: user.isAdmin || false,
              isVerified: user.isVerified || false
            } as Express.User);
          } catch (error) {
            return done(error);
          }
        }
      )
    );
  }

  passport.serializeUser((user: Express.User, done) => done(null, user.id));
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      if (user) {
        done(null, {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImageUrl: user.profileImageUrl,
          isAdmin: user.isAdmin || false,
          isVerified: user.isVerified || false
        } as Express.User);
      } else {
        done(null, false);
      }
    } catch (error) {
      done(error);
    }
  });

  // Routes
  app.post("/api/register", async (req, res, next) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      
      if (!email || !password || !firstName) {
        return res.status(400).json({ message: "Email, password, and first name are required" });
      }

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }

      const hashedPassword = await hashPassword(password);
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        firstName,
        lastName,
      });

      const expressUser: Express.User = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
        isAdmin: user.isAdmin || false,
        isVerified: user.isVerified || false
      };

      req.login(expressUser, (err) => {
        if (err) return next(err);
        res.status(201).json(expressUser);
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: info?.message || "Invalid credentials" });
      }
      
      const expressUser: Express.User = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
        isAdmin: user.isAdmin || false,
        isVerified: user.isVerified || false
      };

      req.login(expressUser, (err) => {
        if (err) return next(err);
        res.json(expressUser);
      });
    })(req, res, next);
  });

  // Google OAuth routes
  app.get("/api/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
  app.get(
    "/api/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/auth?error=google_failed" }),
    (req, res) => {
      res.redirect("/dashboard");
    }
  );

  // GitHub OAuth routes
  app.get("/api/auth/github", passport.authenticate("github", { scope: ["user:email"] }));
  app.get(
    "/api/auth/github/callback",
    passport.authenticate("github", { failureRedirect: "/auth?error=github_failed" }),
    (req, res) => {
      res.redirect("/dashboard");
    }
  );

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated() || !req.user) return res.sendStatus(401);
    res.json({
      id: req.user.id,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      profileImageUrl: req.user.profileImageUrl,
      isAdmin: req.user.isAdmin,
      isVerified: req.user.isVerified
    });
  });
}

export const requireAuth = (req: any, res: any, next: any) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

export const requireAdmin = (req: any, res: any, next: any) => {
  if (!req.isAuthenticated() || !req.user.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};