"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "../../lib/api";

interface LoginResponse {
  access_token: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response: LoginResponse = await apiRequest("/auth/login", {
        method: "POST",
        body: { email, password },
      });

      // Stocker le token JWT dans le localStorage
      localStorage.setItem("token", response.access_token);

      // Rediriger vers la page de gestion WhatsApp
      router.push("/user/whatsapp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <main className="flex items-center justify-center h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </main>
  );
}
