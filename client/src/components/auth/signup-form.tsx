import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/use-auth';
import { FaGoogle, FaFacebook } from 'react-icons/fa';

const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(100)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  terms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
});

type SignupFormValues = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSuccess?: () => void;
}

export function SignupForm({ onSuccess }: SignupFormProps) {
  const { signUp, googleSignIn, facebookSignIn, loading } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      terms: false,
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      setAuthError(null);
      await signUp(data.email, data.password, data.fullName);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      setAuthError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setAuthError(null);
      await googleSignIn();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      setAuthError(error.message);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      setAuthError(null);
      await facebookSignIn();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      setAuthError(error.message);
    }
  };

  return (
    <div className="space-y-4 py-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="John Doe" 
                    {...field} 
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="your@email.com" 
                    {...field} 
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    {...field} 
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-1">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={loading}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-normal text-muted-foreground">
                    I agree to the{' '}
                    <a href="/terms" className="text-accent hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="/privacy" className="text-accent hover:underline">Privacy Policy</a>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {authError && (
            <div className="text-destructive text-sm p-2 border border-destructive/50 rounded-md bg-destructive/10">
              {authError}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-primary-gradient"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs">
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
          disabled={loading}
        >
          <FaGoogle className="mr-2 h-4 w-4" />
          Google
        </Button>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleFacebookSignIn}
          disabled={loading}
        >
          <FaFacebook className="mr-2 h-4 w-4" />
          Facebook
        </Button>
      </div>
    </div>
  );
}
