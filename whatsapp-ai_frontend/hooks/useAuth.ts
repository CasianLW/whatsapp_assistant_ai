"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "../lib/api";

interface AuthResponse {
  access_token: string;
}

export default function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response: AuthResponse = await apiRequest<AuthResponse>(
        "/auth/login",
        {
          method: "POST",
          body: { email, password },
        }
      );

      // Stocke le token dans localStorage
      localStorage.setItem("token", response.access_token);
      router.push("/user"); // Redirige vers le tableau de bord utilisateur
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    nickname: string,
    password: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiRequest("/auth/register", {
        method: "POST",
        body: { email, nickname, password },
      });

      // Stocke le token dans localStorage
      //   localStorage.setItem("token", response.token);
      console.log(response);
      router.push("/login"); // Redirige vers la page de login
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    } finally {
      setLoading(false);
    }
  };

  return { login, register, loading, error };
}
