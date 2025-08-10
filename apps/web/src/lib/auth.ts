import Cookies from "js-cookie";
import { api } from "./api";

export type LoginBody = { email: string; password: string };
export type SignupBody = { email: string; password: string };

export async function login(body: LoginBody) {
  const { data } = await api.post("/auth/login", body);
  Cookies.set("token", data.access_token, { expires: 7 }); // 7 jours
  return data;
}

export async function signup(body: SignupBody) {
  const { data } = await api.post("/auth/signup", body);
  Cookies.set("token", data.access_token, { expires: 7 });
  return data;
}

export function logout() {
  Cookies.remove("token");
}
export function isLoggedIn() {
  return Boolean(Cookies.get("token"));
}
