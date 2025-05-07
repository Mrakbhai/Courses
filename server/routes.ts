import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ZodError } from "zod";
import { insertUserSchema, insertPaymentSchema, insertUserCourseSchema } from "@shared/schema";
import crypto from "crypto";

// Razorpay configuration
const razorpayKeyId = process.env.RAZORPAY_KEY_ID || "rzp_test_yourkeyhere";
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || "yoursecrethere";

export async function registerRoutes(app: Express): Promise<Server> {
  // Middleware to handle errors
  const handleError = (err: any, res: Response) => {
    console.error(err);
    if (err instanceof ZodError) {
      return res.status(400).json({ 
        error: "Validation error", 
        details: err.errors 
      });
    }
    return res.status(500).json({ error: err.message || "Internal server error" });
  };

  // API routes
  app.get("/api/courses", async (req, res) => {
    try {
      const category = req.query.category as string;
      let courses;
      
      if (category && category !== "all") {
        courses = await storage.getCoursesByCategory(category);
      } else {
        courses = await storage.getAllCourses();
      }
      
      res.json(courses);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.get("/api/courses/featured", async (req, res) => {
    try {
      const courses = await storage.getFeaturedCourses();
      res.json(courses);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.get("/api/courses/:slug", async (req, res) => {
    try {
      const course = await storage.getCourseBySlug(req.params.slug);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
      res.json(course);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.get("/api/courses/:courseId/content", async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const content = await storage.getCourseContent(courseId);
      res.json(content);
    } catch (err) {
      handleError(err, res);
    }
  });

  // User endpoints
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(409).json({ error: "User with this email already exists" });
      }
      
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.get("/api/users/me", async (req, res) => {
    try {
      const uid = req.headers["x-user-id"] as string;
      if (!uid) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const user = await storage.getUserByUid(uid);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json(user);
    } catch (err) {
      handleError(err, res);
    }
  });

  // Course purchase and payment endpoints
  app.post("/api/payments/create-order", async (req, res) => {
    try {
      const { courseId, userId } = req.body;
      if (!courseId || !userId) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      
      const course = await storage.getCourse(parseInt(courseId));
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
      
      // Create a unique order ID
      const orderId = crypto.randomBytes(16).toString("hex");
      
      // In a real application, we would initialize a Razorpay order here
      // For now, we'll simulate the order creation
      const order = {
        id: orderId,
        amount: course.price,
        currency: "INR",
        receipt: `receipt_${Date.now()}`
      };
      
      // Create a payment entry in pending state
      const payment = await storage.createPayment({
        userId: parseInt(userId),
        courseId: parseInt(courseId),
        amount: course.price,
        currency: "INR",
        status: "pending",
        razorpayOrderId: orderId
      });
      
      res.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        paymentId: payment.id,
        keyId: razorpayKeyId
      });
    } catch (err) {
      handleError(err, res);
    }
  });

  app.post("/api/payments/verify", async (req, res) => {
    try {
      const { paymentId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
      
      if (!paymentId || !razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
        return res.status(400).json({ error: "Missing payment verification details" });
      }
      
      // In a real application, we would verify the signature here
      // For this demo, we'll assume the payment is successful
      
      // Update payment status
      const payment = await storage.updatePaymentStatus(
        parseInt(paymentId),
        "success",
        razorpayPaymentId
      );
      
      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }
      
      // Add course to user's purchased courses
      await storage.purchaseCourse({
        userId: payment.userId,
        courseId: payment.courseId,
        referralCode: null,
        referredBy: null
      });
      
      res.json({ success: true });
    } catch (err) {
      handleError(err, res);
    }
  });

  // User courses endpoints
  app.get("/api/users/:userId/courses", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const userCourses = await storage.getUserCourses(userId);
      res.json(userCourses);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.post("/api/user-courses/:userCourseId/progress", async (req, res) => {
    try {
      const userCourseId = parseInt(req.params.userCourseId);
      const { completedLessons, progress } = req.body;
      
      if (!completedLessons || typeof progress !== 'number') {
        return res.status(400).json({ error: "Invalid progress data" });
      }
      
      const updatedUserCourse = await storage.updateUserCourseProgress(
        userCourseId,
        completedLessons,
        progress
      );
      
      if (!updatedUserCourse) {
        return res.status(404).json({ error: "User course not found" });
      }
      
      res.json(updatedUserCourse);
    } catch (err) {
      handleError(err, res);
    }
  });

  // Referral endpoints
  app.post("/api/referrals", async (req, res) => {
    try {
      const { userId, courseId } = req.body;
      
      if (!userId || !courseId) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      
      // Generate a unique referral code
      const code = `${userId}-${courseId}-${crypto.randomBytes(4).toString("hex")}`;
      
      const referral = await storage.createReferral({
        userId: parseInt(userId),
        courseId: parseInt(courseId),
        code
      });
      
      res.status(201).json(referral);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.get("/api/referrals/:code", async (req, res) => {
    try {
      const referral = await storage.getReferral(req.params.code);
      
      if (!referral) {
        return res.status(404).json({ error: "Referral not found" });
      }
      
      res.json(referral);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.get("/api/users/:userId/referrals", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const referrals = await storage.getUserReferrals(userId);
      res.json(referrals);
    } catch (err) {
      handleError(err, res);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
