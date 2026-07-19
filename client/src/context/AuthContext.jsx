import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const AuthContext = createContext();

const isFirebaseConfigured = () => {
  const cfg = import.meta.env.VITE_FIREBASE_API_KEY;
  return cfg && cfg !== '' && !cfg.startsWith('your_');
};

const MOCK_USER_KEY = 'quikart_mock_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFirebaseConfigured()) {
      const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
        setUser(fbUser);
        setLoading(false);
      });
      return unsubscribe;
    }

    const stored = localStorage.getItem(MOCK_USER_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        parsed.getIdToken = async () => 'mock-token-' + btoa(unescape(encodeURIComponent(JSON.stringify({ uid: parsed.uid, email: parsed.email }))));
        setUser(parsed);
      } catch { setUser(null); }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    if (isFirebaseConfigured()) {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      return cred.user;
    }
    const mockUser = {
      uid: 'mock-' + Date.now(), email, displayName: email.split('@')[0],
      getIdToken: async () => 'mock-token-' + btoa(unescape(encodeURIComponent(JSON.stringify({ uid: 'mock-uid', email }))))
    };
    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));
    setUser(mockUser);
    return mockUser;
  };

  const signup = async (email, password) => {
    if (isFirebaseConfigured()) {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      return cred.user;
    }
    const mockUser = {
      uid: 'mock-' + Date.now(), email, displayName: email.split('@')[0],
      getIdToken: async () => 'mock-token-' + btoa(unescape(encodeURIComponent(JSON.stringify({ uid: 'mock-uid', email }))))
    };
    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));
    setUser(mockUser);
    return mockUser;
  };

  const logout = async () => {
    if (isFirebaseConfigured()) {
      await signOut(auth);
    } else {
      localStorage.removeItem(MOCK_USER_KEY);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
