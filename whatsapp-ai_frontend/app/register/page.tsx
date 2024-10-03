"use client";

import { useState } from "react";
import useAuth from "../../hooks/useAuth";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { register, loading, error } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    await register(email, nickname, password);
  };

  return (
    <main className="flex items-center justify-center h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
        <form onSubmit={handleRegister}>
          <input
            type="email"
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded"
            placeholder="Nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <input
            type="password"
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className={`w-full py-2 text-white rounded ${
              loading ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"
            }`}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </main>
  );
}
