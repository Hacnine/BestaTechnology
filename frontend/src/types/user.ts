export interface User {
  id: string;
  userName: string;
  password: string;
  role: string;
  employeeId: string;
  // imagine many more fields...
}

export type BasicUser = Pick<User, "id" | "userName" | "role" | "employeeId" | "password">;
