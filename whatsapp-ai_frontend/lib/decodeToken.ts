export interface DecodedToken {
  email: string;
  sub: string; // User ID
  role: string;
  nickname: string;
  iat: number;
  exp: number;
}

// Fonction pour décoder le token JWT
export const decodeToken = (token: string): DecodedToken | null => {
  try {
    const base64Url = token.split(".")[1]; // Récupérer la partie payload
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload) as DecodedToken; // Retourner le payload du token
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
};
