import { createContext, useContext, useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from '../../node_modules/firebase/auth';
import { auth } from '../firebase';

export const authContext = createContext();

export const useAuth = ()=>{
  const context = useContext(authContext);
  if(!context) throw new Error('There is not auth provider.');
  return context;
}

export function AuthProvider({children}) {

  const[user, setUser] = useState(null);
  const[loading, setLoading] = useState(true);

  const signup = async (email, password) => {
   //Firebase
    return await createUserWithEmailAndPassword(auth, email, password, logout);
  }

  const login = async (email, password) => {
    //Firebase
    return await signInWithEmailAndPassword(auth, email, password);
  }

  const logout = async () => {
    return await signOut(auth);
  }

  const loginWithGoogle = async () => {
    const googleProvider = new GoogleAuthProvider();
    return await signInWithPopup(auth, googleProvider);
  }

  const resetPassword = async (email) => {
    //Firebase 
    return await sendPasswordResetEmail(auth, email);
  }

  useEffect(()=>{
    const unSuscribe = onAuthStateChanged(auth, currentUser=>{
      setUser(currentUser);
      setLoading(false);
    });
    return () => unSuscribe;
  },[])

  return(
    <authContext.Provider value={{ signup, login, user, loading, logout, loginWithGoogle, resetPassword }}>
      {children}
    </authContext.Provider>
  )
}