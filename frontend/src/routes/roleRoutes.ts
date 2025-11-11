import { APP_ROUTES } from "./APP_ROUTES";

export type UserRole =
  | "ADMIN"
  | "MANAGEMENT"
  | "MERCHANDISER"
  | "CAD"
  | "SAMPLE_FABRIC"
  | "SAMPLE_ROOM";

export const roleRoutes: Record<UserRole, string> = {
  ADMIN: APP_ROUTES.admin_dashboard,
  MANAGEMENT: APP_ROUTES.management_dashboard,
  MERCHANDISER: APP_ROUTES.merchandiser_dashboard,
  CAD: APP_ROUTES.cad_dashboard,
  SAMPLE_FABRIC: APP_ROUTES.sample_fabric_dashboard,
  SAMPLE_ROOM: APP_ROUTES.sample_room_dashboard,
};

export const getRouteForRole = (role?: string | null) =>
  (role && (roleRoutes as Record<string, string>)[role]) || APP_ROUTES.login;

export default getRouteForRole;
