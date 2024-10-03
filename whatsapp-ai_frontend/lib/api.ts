const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;

type RequestOptions = {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: HeadersInit;
  body?: object;
  token?: string; // Ajout d'une option pour inclure le token d'authentification
};

// Typage du retour de `apiRequest`
export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions
): Promise<T> {
  const { method, headers, body, token } = options;

  const response = await fetch(`${apiUrl}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }), // Ajoute le token si disponible
      ...headers,
    },
    body: body ? JSON.stringify(body) : null,
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}
