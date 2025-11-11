import { BasicUser } from "./user";

export interface Employee {
  id: string;
  customId: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  status: string;
  designation: string;
  department: string;
  user: BasicUser;
}
export type BasicEmployee = Pick<Employee, "id" | "customId" | "name" | "email" | "designation" | "department" | "status">;
