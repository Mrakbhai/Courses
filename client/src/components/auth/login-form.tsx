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
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/use-auth';
import { FaGoogle, FaFacebook } from 'react-icons/fa';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { signIn, googleSignIn, facebookSignIn, loading } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setAuthError(null);
      await signIn(data.email, data.password);
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
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <Button 
                    variant="link" 
                    className="text-xs p-0 h-auto text-accent"
                    type="button"
                  >
                    Forgot password?
                  </Button>
                </div>
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
            {loading ? 'Signing in...' : 'Sign In'}
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
