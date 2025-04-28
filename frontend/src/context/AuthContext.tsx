"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter, usePathname } from "next/navigation"; // <-- Import usePathname here

interface DecodedToken {
  id: string;
  role: string;
  email: string;
  username: string;
  exp?: number;
  iat?: number;
}

interface AuthContextType {
  user: DecodedToken | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const router = useRouter(); // <-- Keep using next/navigation's useRouter for navigation
  const pathname = usePathname(); // <-- Replace router.pathname with usePathname()

  // Utility to read cookie
  const getCookie = (name: string): string | null => {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    return match ? match[2] : null;
  };

  // Utility to delete cookie
  const deleteCookie = (name: string) => {
    if (typeof document !== "undefined") {
      document.cookie =
        name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    }
  };

  // Logout helper
  const logout = () => {
    setUser(null);
    deleteCookie("auth_token");
    console.log("Logged out, redirecting to /signin");
    if (!["/signin", "/signup"].includes(pathname)) {
      router.replace("/signin");
    }
  };

  useEffect(() => {
    console.log("useEffect triggered, checking token...");

    const token = getCookie("auth_token");
    console.log("Token from cookie:", token);

    if (token) {
      try {
        console.log("Token found, decoding...");
        const decoded = jwtDecode<DecodedToken>(token);
        console.log("Decoded token:", decoded);

        // Optional: check expiration
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          throw new Error("Token expired");
        }
        setUser(decoded);
        console.log("User decoded and set:", decoded);

        // Redirect away from auth pages if already authenticated
        if (["/signin", "/signup"].includes(pathname)) {
          console.log(
            "Authenticated user on signin/signup page, redirecting to /dashboard"
          );
          router.replace("/dashboard");
        }
      } catch (err) {
        console.error("Token invalid or expired", err);
        logout();
      }
    } else {
      // No token
      console.log("No token found, redirecting to /signin");
      if (!["/signin", "/signup"].includes(pathname)) {
        router.replace("/signin");
      }
    }
  }, [pathname]); // <-- Watch for pathname changes

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
