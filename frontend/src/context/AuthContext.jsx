import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import axios from "../api/axios";
import { jwtDecode } from 'jwt-decode';

// Create the context
const AuthContext = createContext();

// Custom hook for convenience
export const useAuth = () => useContext(AuthContext);

//Provider
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(token ? jwtDecode(token) : null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [pinVerified, setPinVerified] = useState(false);

  // Persist login state
  useEffect(() => {
    if (token) {
      setUser(jwtDecode(token));
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, [token]);

  //login
  const login = async (email, password) => {
    try {
        const res = await axios.post("/users/login", { email, password });
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        setUser(jwtDecode(res.data.token));
        setIsAuthenticated(true);
        return { success: true };

    } catch (error) {
        return { success: false, message: err.response?.data?.message || "Login failed" };
    }
  }

  // 🔓 Logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setPinVerified(false);
  };

  // 🔐 Verify PIN
  const verifyPin = async (pin) => {
    try {
      const res = await axios.post(
        "/api/users/verify-pin",
        { pin },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setPinVerified(true);
        return { success: true };
      } else {
        return { success: false, message: "Invalid PIN" };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "PIN verification failed" };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        pinVerified,
        login,
        logout,
        verifyPin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );


};
