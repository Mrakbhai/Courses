import { useState } from 'react';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginForm } from '@/components/auth/login-form';
import { SignupForm } from '@/components/auth/signup-form';
import { Button } from '@/components/ui/button';
import { signInWithGoogle, signInWithFacebook } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const { toast } = useToast();
  const { user } = useAuth();
  
  // If already logged in, redirect to dashboard
  if (user) {
    setLocation('/dashboard');
    return null;
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast({
        title: "Success!",
        description: "You've successfully signed in with Google.",
      });
      setLocation('/dashboard');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: error.message || "There was a problem signing in with Google.",
      });
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      await signInWithFacebook();
      toast({
        title: "Success!",
        description: "You've successfully signed in with Facebook.",
      });
      setLocation('/dashboard');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: error.message || "There was a problem signing in with Facebook.",
      });
    }
  };

  const handleSuccess = () => {
    setLocation('/dashboard');
  };

  return (
    <>
      <Helmet>
        <title>{activeTab === 'login' ? 'Login' : 'Sign Up'} | Wiser Material</title>
        <meta 
          name="description" 
          content={activeTab === 'login' 
            ? 'Login to your Wiser Material account to access premium courses and track your learning progress.' 
            : 'Create your Wiser Material account to start your learning journey with premium money-making skills courses.'}
        />
      </Helmet>

      <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-gradient-to-b from-background to-secondary/30">
        <div className="w-full max-w-md">
          <Button 
            variant="ghost" 
            className="mb-6" 
            onClick={() => setLocation('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>

          <Card className="w-full shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                {activeTab === 'login' ? 'Welcome Back!' : 'Create an Account'}
              </CardTitle>
              <CardDescription className="text-center">
                {activeTab === 'login' 
                  ? 'Sign in to continue your learning journey' 
                  : 'Join Wiser Material and unlock premium content'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs 
                defaultValue={activeTab} 
                onValueChange={(value) => setActiveTab(value as 'login' | 'signup')}
              >
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <LoginForm onSuccess={handleSuccess} />
                </TabsContent>
                <TabsContent value="signup">
                  <SignupForm onSuccess={handleSuccess} />
                </TabsContent>
              </Tabs>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleGoogleSignIn}
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg">
                    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                      <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                      <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                      <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                      <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                    </g>
                  </svg>
                  Google
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleFacebookSignIn}
                >
                  <svg className="h-5 w-5 mr-2 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z"></path>
                  </svg>
                  Facebook
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center text-sm text-muted-foreground">
                {activeTab === 'login' ? (
                  <>
                    Don't have an account?{' '}
                    <span 
                      className="cursor-pointer underline text-primary-light"
                      onClick={() => setActiveTab('signup')}
                    >
                      Sign up
                    </span>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <span 
                      className="cursor-pointer underline text-primary-light"
                      onClick={() => setActiveTab('login')}
                    >
                      Log in
                    </span>
                  </>
                )}
              </div>
              <Button 
                variant="link" 
                className="text-muted-foreground"
                onClick={() => setLocation('/courses')}
              >
                Explore courses without signing in
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}