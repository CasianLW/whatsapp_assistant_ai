"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import QRConnectionModal from "@/components/whatsapp/QRConnectionModal";
import { decodeToken } from "@/lib/decodeToken";

interface WhatsAppSession {
  userId: string;
  sessionId: string;
  isActive: boolean;
}

export default function WhatsAppConnection() {
  const [session, setSession] = useState<WhatsAppSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isQRModalVisible, setQRModalVisible] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>(""); // Stocker le `userId` décodé
  const router = useRouter();

  // Récupérer le token JWT depuis localStorage
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (token) {
      const decoded = decodeToken(token);
      console.log("Decoded Token:", decoded); // Affiche le token décodé pour vérifier
      if (decoded) {
        setUserId(decoded.sub); // Assigner l'ID utilisateur
        checkSession(token);
      }
    } else {
      router.push("/login");
    }
  }, [token, router]);

  const checkSession = async (token: string) => {
    try {
      setIsLoading(true);
      const data = await apiRequest<WhatsAppSession>("/whatsapp/get-session", {
        method: "GET",
        token,
      });
      setSession(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch session");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded">
        <h1 className="text-2xl font-bold mb-6 text-center">
          WhatsApp Connection Management
        </h1>
        {isLoading && <p>Loading...</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {!session ? (
          <div>
            <p className="text-center text-gray-600 mb-6">
              No active session found.
            </p>
            <button
              onClick={() => setQRModalVisible(true)}
              className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? "Creating session..." : "Create WhatsApp Session"}
            </button>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-xl mb-4">Session Active</h2>
            <p className="mb-4">Session ID: {session.sessionId}</p>
            <button
              onClick={() => setQRModalVisible(true)}
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Show QR Code
            </button>
          </div>
        )}

        {/* Intégration de la modale QR */}
        <QRConnectionModal
          visible={isQRModalVisible}
          onClose={() => setQRModalVisible(false)}
          userId={userId} // Passer le `userId` décodé à la modale
        />
      </div>
    </main>
  );
}
