import { supabase } from "./supabaseClient";
import { v4 as uuid } from "uuid";

export async function createUser(mail: string, pass: string) {
    return await supabase.from("users").insert([{id: uuid(), mail, pass}]).select("id, mail, pass");
}

export async function loginUser(mail: string, pass: string) {
    const res = await fetch('api/auth/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({mail,pass}),
        credentials: 'include',
    });

    if(res.ok) {
        const error = await res.json();
        return {error}
    }

    return {error: null};
}

export async function createProps(name: string, price:number,seller: string) {
    return await supabase.from("props").insert([{id: uuid(), name, price,seller}]);
}

export function extractAccessToken(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").map((c) => c.trim());
  const accessTokenCookie = cookies.find((c) => c.startsWith("access_token="));

  if (!accessTokenCookie) return null;

  return accessTokenCookie.split("=")[1];
}

