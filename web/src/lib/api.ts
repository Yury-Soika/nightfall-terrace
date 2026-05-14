export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function apiGet<T>(
  path: string,
  opts?: { token?: string }
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    cache: "no-store",
    headers: {
      ...(opts?.token ? { authorization: `Bearer ${opts.token}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return (await res.json()) as T;
}

export async function apiPost<T>(
  path: string,
  body: unknown,
  opts?: { token?: string }
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(opts?.token ? { authorization: `Bearer ${opts.token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
  return (await res.json()) as T;
}

export async function apiPatch<T>(
  path: string,
  body: unknown,
  opts?: { token?: string }
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      ...(opts?.token ? { authorization: `Bearer ${opts.token}` } : {}),
    },
    body: JSON.stringify(body ?? {}),
  });
  if (!res.ok) throw new Error(`PATCH ${path} failed: ${res.status}`);
  return (await res.json()) as T;
}

export async function apiDelete<T>(
  path: string,
  opts?: { token?: string }
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "DELETE",
    headers: {
      ...(opts?.token ? { authorization: `Bearer ${opts.token}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`DELETE ${path} failed: ${res.status}`);
  return (await res.json()) as T;
}

