import {
  users,
  courses,
  courseContent,
  userCourses,
  payments,
  referrals,
  type User,
  type InsertUser,
  type Course,
  type InsertCourse,
  type CourseContent,
  type InsertCourseContent,
  type UserCourse,
  type InsertUserCourse,
  type Payment,
  type InsertPayment,
  type Referral,
  type InsertReferral,
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUid(uid: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;

  // Course methods
  getCourse(id: number): Promise<Course | undefined>;
  getCourseBySlug(slug: string): Promise<Course | undefined>;
  getAllCourses(): Promise<Course[]>;
  getCoursesByCategory(category: string): Promise<Course[]>;
  getFeaturedCourses(): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: number, course: Partial<Course>): Promise<Course | undefined>;
  deleteCourse(id: number): Promise<boolean>;

  // Course content methods
  getCourseContent(courseId: number): Promise<CourseContent[]>;
  createCourseContent(content: InsertCourseContent): Promise<CourseContent>;

  // User courses methods
  getUserCourses(userId: number): Promise<(UserCourse & { course: Course })[]>;
  getUserCourse(userId: number, courseId: number): Promise<UserCourse | undefined>;
  purchaseCourse(userCourse: InsertUserCourse): Promise<UserCourse>;
  updateUserCourseProgress(id: number, completedLessons: number[], progress: number): Promise<UserCourse | undefined>;

  // Payment methods
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPaymentsByUser(userId: number): Promise<Payment[]>;
  updatePaymentStatus(id: number, status: string, razorpayPaymentId?: string): Promise<Payment | undefined>;

  // Referral methods
  getReferral(code: string): Promise<Referral | undefined>;
  createReferral(referral: InsertReferral): Promise<Referral>;
  updateReferralUsedCount(id: number): Promise<Referral | undefined>;
  getUserReferrals(userId: number): Promise<Referral[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private courses: Map<number, Course>;
  private courseContents: Map<number, CourseContent>;
  private userCourses: Map<number, UserCourse>;
  private payments: Map<number, Payment>;
  private referrals: Map<number, Referral>;
  
  private currentUserId: number;
  private currentCourseId: number;
  private currentContentId: number;
  private currentUserCourseId: number;
  private currentPaymentId: number;
  private currentReferralId: number;

  constructor() {
    this.users = new Map();
    this.courses = new Map();
    this.courseContents = new Map();
    this.userCourses = new Map();
    this.payments = new Map();
    this.referrals = new Map();
    
    this.currentUserId = 1;
    this.currentCourseId = 1;
    this.currentContentId = 1;
    this.currentUserCourseId = 1;
    this.currentPaymentId = 1;
    this.currentReferralId = 1;

    // Initialize with sample courses
    this.initializeSampleData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUid(uid: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.uid === uid);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const newUser: User = { ...user, id, createdAt: new Date() };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser: User = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Course methods
  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async getCourseBySlug(slug: string): Promise<Course | undefined> {
    return Array.from(this.courses.values()).find(course => course.slug === slug);
  }

  async getAllCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }

  async getCoursesByCategory(category: string): Promise<Course[]> {
    return Array.from(this.courses.values()).filter(course => course.category === category);
  }

  async getFeaturedCourses(): Promise<Course[]> {
    return Array.from(this.courses.values()).filter(course => course.isFeatured);
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const id = this.currentCourseId++;
    const newCourse: Course = { ...course, id, createdAt: new Date() };
    this.courses.set(id, newCourse);
    return newCourse;
  }

  async updateCourse(id: number, courseData: Partial<Course>): Promise<Course | undefined> {
    const course = this.courses.get(id);
    if (!course) return undefined;

    const updatedCourse: Course = { ...course, ...courseData };
    this.courses.set(id, updatedCourse);
    return updatedCourse;
  }

  async deleteCourse(id: number): Promise<boolean> {
    return this.courses.delete(id);
  }

  // Course content methods
  async getCourseContent(courseId: number): Promise<CourseContent[]> {
    return Array.from(this.courseContents.values())
      .filter(content => content.courseId === courseId)
      .sort((a, b) => a.order - b.order);
  }

  async createCourseContent(content: InsertCourseContent): Promise<CourseContent> {
    const id = this.currentContentId++;
    const newContent: CourseContent = { ...content, id };
    this.courseContents.set(id, newContent);
    return newContent;
  }

  // User courses methods
  async getUserCourses(userId: number): Promise<(UserCourse & { course: Course })[]> {
    const userCourses = Array.from(this.userCourses.values()).filter(uc => uc.userId === userId);
    return userCourses.map(uc => {
      const course = this.courses.get(uc.courseId)!;
      return { ...uc, course };
    });
  }

  async getUserCourse(userId: number, courseId: number): Promise<UserCourse | undefined> {
    return Array.from(this.userCourses.values()).find(
      uc => uc.userId === userId && uc.courseId === courseId
    );
  }

  async purchaseCourse(userCourse: InsertUserCourse): Promise<UserCourse> {
    const id = this.currentUserCourseId++;
    const newUserCourse: UserCourse = { 
      ...userCourse, 
      id, 
      purchasedAt: new Date(),
      completedLessons: [],
      progress: 0 
    };
    this.userCourses.set(id, newUserCourse);
    return newUserCourse;
  }

  async updateUserCourseProgress(
    id: number,
    completedLessons: number[],
    progress: number
  ): Promise<UserCourse | undefined> {
    const userCourse = this.userCourses.get(id);
    if (!userCourse) return undefined;

    const updatedUserCourse: UserCourse = { 
      ...userCourse, 
      completedLessons,
      progress
    };
    this.userCourses.set(id, updatedUserCourse);
    return updatedUserCourse;
  }

  // Payment methods
  async createPayment(payment: InsertPayment): Promise<Payment> {
    const id = this.currentPaymentId++;
    const newPayment: Payment = { ...payment, id, createdAt: new Date() };
    this.payments.set(id, newPayment);
    return newPayment;
  }

  async getPaymentsByUser(userId: number): Promise<Payment[]> {
    return Array.from(this.payments.values()).filter(payment => payment.userId === userId);
  }

  async updatePaymentStatus(
    id: number,
    status: string,
    razorpayPaymentId?: string
  ): Promise<Payment | undefined> {
    const payment = this.payments.get(id);
    if (!payment) return undefined;

    const updatedPayment: Payment = { 
      ...payment, 
      status,
      ...(razorpayPaymentId ? { razorpayPaymentId } : {})
    };
    this.payments.set(id, updatedPayment);
    return updatedPayment;
  }

  // Referral methods
  async getReferral(code: string): Promise<Referral | undefined> {
    return Array.from(this.referrals.values()).find(referral => referral.code === code);
  }

  async createReferral(referral: InsertReferral): Promise<Referral> {
    const id = this.currentReferralId++;
    const newReferral: Referral = { ...referral, id, createdAt: new Date(), usedCount: 0 };
    this.referrals.set(id, newReferral);
    return newReferral;
  }

  async updateReferralUsedCount(id: number): Promise<Referral | undefined> {
    const referral = this.referrals.get(id);
    if (!referral) return undefined;

    const updatedReferral: Referral = { 
      ...referral, 
      usedCount: referral.usedCount + 1
    };
    this.referrals.set(id, updatedReferral);
    return updatedReferral;
  }

  async getUserReferrals(userId: number): Promise<Referral[]> {
    return Array.from(this.referrals.values()).filter(referral => referral.userId === userId);
  }

  // Helper methods
  private initializeSampleData() {
    // Sample courses
    const courses: InsertCourse[] = [
      {
        slug: "student-money-making",
        title: "Student Money Making",
        description: "Learn how to earn money while studying without compromising your academics.",
        category: "money-making",
        instructorId: 1,
        instructorName: "Alex Morgan",
        instructorTitle: "Student Entrepreneur",
        instructorPhoto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
        price: 499900, // ₹4,999
        originalPrice: 999900, // ₹9,999
        duration: "8 weeks",
        lessons: 24,
        level: "beginner",
        isFeatured: true,
        isPublished: true,
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f",
        badge: "BESTSELLER",
      },
      {
        slug: "business-starter",
        title: "Business Starter",
        description: "Launch your first business with proven frameworks for success and growth.",
        category: "business",
        instructorId: 2,
        instructorName: "James Wilson",
        instructorTitle: "Serial Entrepreneur",
        instructorPhoto: "https://images.unsplash.com/photo-1560250097-0b93528c311a",
        price: 599900, // ₹5,999
        originalPrice: 1199900, // ₹11,999
        duration: "10 weeks",
        lessons: 32,
        level: "intermediate",
        isFeatured: true,
        isPublished: true,
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
        badge: "POPULAR",
      },
      {
        slug: "investing-mastery",
        title: "Investing Mastery",
        description: "Master stock markets, crypto, real estate, and alternative investment strategies.",
        category: "investing",
        instructorId: 3,
        instructorName: "Sophia Chen",
        instructorTitle: "Investment Strategist",
        instructorPhoto: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e",
        price: 799900, // ₹7,999
        originalPrice: 1499900, // ₹14,999
        duration: "12 weeks",
        lessons: 40,
        level: "advanced",
        isFeatured: true,
        isPublished: true,
        image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3",
        badge: "",
      },
      {
        slug: "ai-productivity",
        title: "AI Productivity",
        description: "Leverage AI tools to 10x your productivity and automate repetitive tasks.",
        category: "ai-mastery",
        instructorId: 4,
        instructorName: "Robert Martinez",
        instructorTitle: "AI Specialist",
        instructorPhoto: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5",
        price: 899900, // ₹8,999
        originalPrice: 1699900, // ₹16,999
        duration: "6 weeks",
        lessons: 28,
        level: "intermediate",
        isFeatured: true,
        isPublished: true,
        image: "https://pixabay.com/get/g779e6b338644b5baaa7881c0221572d16b3883bcc3661da31db875c3f8775dd6471e64881007044b1b500ba81ac5ae043bfcf452bdc08a35735dbb6b11850525_1280.jpg",
        badge: "NEW",
      }
    ];

    // Add sample courses
    courses.forEach(course => {
      const id = this.currentCourseId++;
      const newCourse: Course = { ...course, id, createdAt: new Date() };
      this.courses.set(id, newCourse);
    });
  }
}

export const storage = new MemStorage();
