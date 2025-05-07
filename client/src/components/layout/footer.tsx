import { Link } from 'wouter';
import { BookOpen, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Footer() {
  return (
    <footer className="pt-16 pb-8 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="bg-primary-gradient p-2 rounded-lg mr-2">
                <BookOpen className="text-white text-xl" />
              </div>
              <span className="font-inter font-bold text-xl text-foreground">Wiser Material</span>
            </div>
            <p className="mb-6 text-muted-foreground">
              Premium educational platform focused on teaching money-making skills, business, investing, and productivity.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: <Facebook className="h-4 w-4" />, href: "#" },
                { icon: <Twitter className="h-4 w-4" />, href: "#" },
                { icon: <Instagram className="h-4 w-4" />, href: "#" },
                { icon: <Linkedin className="h-4 w-4" />, href: "#" },
              ].map((social, index) => (
                <Link 
                  key={index} 
                  href={social.href}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    "bg-background text-foreground"
                  )}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4 font-inter text-foreground">Courses</h3>
            <ul className="space-y-3">
              {[
                { name: "Student Money Making", href: "/courses/student-money-making" },
                { name: "Business Starter", href: "/courses/business-starter" },
                { name: "Investing Mastery", href: "/courses/investing-mastery" },
                { name: "AI Productivity", href: "/courses/ai-productivity" },
                { name: "Course Bundles", href: "/courses/bundles" },
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-muted-foreground hover:text-accent"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4 font-inter text-foreground">Resources</h3>
            <ul className="space-y-3">
              {[
                { name: "Blog", href: "/blog" },
                { name: "Free Guides", href: "/guides" },
                { name: "Webinars", href: "/webinars" },
                { name: "Success Stories", href: "/#testimonials" },
                { name: "FAQ", href: "/faq" },
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-muted-foreground hover:text-accent"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4 font-inter text-foreground">Company</h3>
            <ul className="space-y-3">
              {[
                { name: "About Us", href: "/about" },
                { name: "Instructors", href: "/instructors" },
                { name: "Careers", href: "/careers" },
                { name: "Contact", href: "/contact" },
                { name: "Affiliate Program", href: "/affiliate" },
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-muted-foreground hover:text-accent"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Motivational Quote */}
        <div className="border-t border-b py-8 my-8 text-center border-border">
          <blockquote className="text-xl italic font-medium mb-2 text-foreground">
            "The best investment you can make is in yourself."
          </blockquote>
          <cite className="text-sm text-muted-foreground">— Warren Buffett</cite>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm mb-4 md:mb-0 text-muted-foreground">
            © {new Date().getFullYear()} Wiser Material. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-accent">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-accent">
              Privacy Policy
            </Link>
            <Link href="/cookies" className="text-sm text-muted-foreground hover:text-accent">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
