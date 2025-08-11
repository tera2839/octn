import { supabase } from "./supabaseClient";
import { v4 as uuid } from "uuid";

export async function createUser(mail: string, pass: string) {
    return await supabase.from("users").insert([{id: uuid(), mail, pass}]).select("id, mail, pass");
}

export async function loginUser(mail: string, pass: string) {
    const {error} = await supabase.auth.signUp({
        email: mail,
        password: pass
    });

    return {error};
}

export async function createProps(name: string, price:number,seller: string) {
    return await supabase.from("props").insert([{id: uuid(), name, price,seller}]);
}

export async function getReceipt() {
  
}

