import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User
} from "firebase/auth";
import { apiRequest } from "./queryClient";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Auth providers
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

const facebookProvider = new FacebookAuthProvider();
facebookProvider.setCustomParameters({
  'display': 'popup'
});

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error("Error signing in with email and password:", error);
    throw error;
  }
};

// Sign up with email and password
export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error("Error signing up with email and password:", error);
    throw error;
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    
    // The signed-in user info
    const user = result.user;
    
    // This gives you a Google Access Token. You can use it to access Google APIs.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    
    // Store the token in session storage (cleared when browser is closed)
    if (token) {
      sessionStorage.setItem('googleAccessToken', token);
    }
    
    // Create or update user profile
    await createOrUpdateUserProfile(user);
    
    return user;
  } catch (error: any) {
    console.error("Error signing in with Google:", error);
    
    // Handle specific Firebase auth errors
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Login cancelled by user. Please try again.');
    } else if (error.code === 'auth/popup-blocked') {
      throw new Error('Login popup was blocked. Please allow popups for this site and try again.');
    }
    
    throw error;
  }
};

// Sign in with Facebook
export const signInWithFacebook = async () => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    
    // The signed-in user info
    const user = result.user;
    
    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    const credential = FacebookAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    
    // Store the token in session storage (cleared when browser is closed)
    if (token) {
      sessionStorage.setItem('facebookAccessToken', token);
    }
    
    // Create or update user profile
    await createOrUpdateUserProfile(user);
    
    return user;
  } catch (error: any) {
    console.error("Error signing in with Facebook:", error);
    
    // Handle specific Firebase auth errors
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Login cancelled by user. Please try again.');
    } else if (error.code === 'auth/popup-blocked') {
      throw new Error('Login popup was blocked. Please allow popups for this site and try again.');
    } else if (error.code === 'auth/account-exists-with-different-credential') {
      throw new Error('An account already exists with the same email address but different sign-in credentials. Sign in using the provider associated with this email address.');
    }
    
    throw error;
  }
};

// Sign out
export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// Create or update user profile in our database
export const createOrUpdateUserProfile = async (user: User) => {
  if (!user) return;

  try {
    // Extract relevant user data from Firebase user
    const userData = {
      uid: user.uid,
      email: user.email,
      fullName: user.displayName || '',
      photoURL: user.photoURL || '',
      phoneNumber: user.phoneNumber || '',
      emailVerified: user.emailVerified,
      provider: user.providerData?.[0]?.providerId || 'unknown',
    };

    // Send the data to our API to create or update user profile
    const response = await apiRequest('/api/users/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    return response;
  } catch (error) {
    console.error('Error creating/updating user profile:', error);
    // Non-critical error, don't throw so authentication still succeeds
  }
};

// Update user profile in Firebase
export const updateUserDisplayName = async (displayName: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  try {
    await updateProfile(user, { displayName });
    return user;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Update user photo in Firebase
export const updateUserPhoto = async (photoURL: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  try {
    await updateProfile(user, { photoURL });
    return user;
  } catch (error) {
    console.error('Error updating user photo:', error);
    throw error;
  }
};

// Auth state observer
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export { auth };
