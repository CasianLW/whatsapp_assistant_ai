"use client";

import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { Button, Modal, Spin } from "antd"; // Utilisation d'Ant Design pour le style
import { apiRequest } from "@/lib/api"; // Utilisation de notre helper API

export interface QRCodeResponse {
  status: string; // 'ready' ou autre
  qr: string; // Valeur du QR code
}

interface QRConnectionModalProps {
  visible: boolean;
  onClose: () => void;
  userId: string;
}

const QRConnectionModal: React.FC<QRConnectionModalProps> = ({
  visible,
  onClose,
  userId,
}) => {
  const [qrCode, setQrCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      pollQRCode(); // Start polling when the modal is opened
    }
  }, [visible]);

  // Fonction pour effectuer le polling du QR code
  const pollQRCode = async () => {
    setLoading(true);
    setError(null);

    try {
      let isPolling = true;
      while (isPolling) {
        console.log(`Polling QR code for user ID: ${userId}`); // Log de débogage
        const response: QRCodeResponse = await apiRequest<QRCodeResponse>(
          `/whatsapp/poll-qr/${userId}`,
          {
            method: "GET",
          }
        );

        console.log("API Response (pollQRCode):", response); // Log de la réponse API

        if (response.status === "ready") {
          setQrCode(response.qr);
          setLoading(false);
          isPolling = false; // Stop polling when QR code is ready
        } else {
          await new Promise((resolve) => setTimeout(resolve, 2000)); // Poll every 2 seconds
        }
      }
    } catch (error) {
      console.error("Failed to poll QR code:", error);
      setError("Failed to fetch QR code. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Connect WhatsApp"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
    >
      <div style={{ textAlign: "center", padding: "20px" }}>
        {loading ? (
          <Spin size="large" />
        ) : qrCode ? (
          <>
            <p>Scan this QR code with your WhatsApp to connect:</p>
            <QRCode value={qrCode} size={256} />
          </>
        ) : (
          <p>{error || "QR code not available. Please try again later."}</p>
        )}
      </div>
    </Modal>
  );
};

export default QRConnectionModal;
