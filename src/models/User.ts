export type UserRole = "admin" | "customer";

export interface User {
  id: number;
  name: string;
  email: string; // stored lowercase
  password?: string; // hashed
  phone: string;
  role: UserRole;
  created_at?: string;
}
