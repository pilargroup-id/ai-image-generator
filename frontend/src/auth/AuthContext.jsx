import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const PILARGROUP_URL = import.meta.env.VITE_PILARGROUP_URL || "https://pilargroup.id";
const TOKEN_KEY = "fl_token";
const USER_KEY = "fl_user";
const APP_KEY = "framelens";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);

  const decodeJwt = (tkn) => {
    const parts = tkn.split(".");
    if (parts.length !== 3) {
      throw new Error("Format token tidak valid");
    }

    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  };

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common.Authorization;
  }, []);

  const processToken = useCallback(
    (tkn) => {
      try {
        const payload = decodeJwt(tkn);

        if (payload.exp && payload.exp * 1000 < Date.now()) {
          throw new Error("Token expired");
        }

        const apps = payload.apps || [];
        if (!apps.includes(APP_KEY)) {
          // Punya token valid tapi gak punya akses FL
          // Jangan redirect ke login (loop), langsung ke dashboard PG
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          setLoading(false);
          window.location.href = `${PILARGROUP_URL}/dashboard`;
          return;
        }

        const userData = {
          id: payload.sub,
          internal_id: payload.internal_id,
          username: payload.username,
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          department: payload.department,
          job_position: payload.job_position,
          apps: payload.apps,
          cv: payload.cv,
        };

        localStorage.setItem(TOKEN_KEY, tkn);
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
        axios.defaults.headers.common.Authorization = `Bearer ${tkn}`;
        setToken(tkn);
        setUser(userData);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    },
    [logout]
  );

  const redirectToLogin = useCallback(() => {
    const returnUrl = encodeURIComponent(window.location.origin)
    window.location.href = `${PILARGROUP_URL}?return_url=${returnUrl}`
  }, [])

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common.Authorization;
    }
  }, [token]);

  useEffect(() => {
    const id = axios.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response?.status === 401) logout();
        return Promise.reject(err);
      }
    );

    return () => axios.interceptors.response.eject(id);
  }, [logout]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");

    if (tokenFromUrl) {
      const url = new URL(window.location.href);
      url.searchParams.delete("token");
      url.searchParams.delete("source");
      url.searchParams.delete("project");
      window.history.replaceState({}, "", url.toString());
      processToken(tokenFromUrl);
      return;
    }

    if (token) {
      processToken(token);
    } else {
      setLoading(false);
    }
  }, [token, processToken]);

  return <AuthContext.Provider value={{ user, token, loading, logout, redirectToLogin }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth harus dipakai di dalam AuthProvider");
  }
  return ctx;
}
