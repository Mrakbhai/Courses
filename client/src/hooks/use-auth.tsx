import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { 
  auth, 
  signInWithEmail, 
  signUpWithEmail, 
  signInWithGoogle, 
  signInWithFacebook, 
  logOut, 
  onAuthChange 
} from '@/lib/firebase';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  userProfile: any | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  googleSignIn: () => Promise<void>;
  facebookSignIn: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
      
      if (user) {
        fetchUserProfile(user);
      } else {
        setUserProfile(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserProfile = async (user: User) => {
    try {
      const response = await fetch('/api/users/me', {
        headers: {
          'X-User-ID': user.uid
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
      } else {
        // User exists in Firebase but not in our database
        // Create user profile in our database
        if (response.status === 404) {
          createUserProfile(user);
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const createUserProfile = async (user: User) => {
    try {
      const response = await apiRequest('POST', '/api/users', {
        uid: user.uid,
        email: user.email,
        username: user.email?.split('@')[0] || `user_${Date.now()}`,
        fullName: user.displayName || 'New User',
        photoURL: user.photoURL,
        isAdmin: false
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error creating user profile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      await signInWithEmail(email, password);
      toast({
        title: "Success",
        description: "You are now signed in",
      });
    } catch (error: any) {
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Sign In Failed",
        description: error.message,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true);
      setError(null);
      const newUser = await signUpWithEmail(email, password);
      
      // Create user profile in our database
      await apiRequest('POST', '/api/users', {
        uid: newUser.uid,
        email: newUser.email,
        username: email.split('@')[0],
        fullName,
        photoURL: null,
        isAdmin: false
      });
      
      toast({
        title: "Success",
        description: "Account created successfully",
      });
    } catch (error: any) {
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: error.message,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const googleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle();
      toast({
        title: "Success",
        description: "You are now signed in with Google",
      });
    } catch (error: any) {
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Google Sign In Failed",
        description: error.message,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const facebookSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithFacebook();
      toast({
        title: "Success",
        description: "You are now signed in with Facebook",
      });
    } catch (error: any) {
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Facebook Sign In Failed",
        description: error.message,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await logOut();
      toast({
        title: "Success",
        description: "You are now signed out",
      });
    } catch (error: any) {
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Sign Out Failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    error,
    signIn,
    signUp,
    googleSignIn,
    facebookSignIn,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
