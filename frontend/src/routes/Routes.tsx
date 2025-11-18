// NOTE: sample-room route is registered further below inside the router.
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { APP_ROUTES } from "./APP_ROUTES";
import { LoginPage } from "@/components/auth/LoginPage";
import { getRouteForRole } from "@/routes/roleRoutes";
import { Layout } from "@/components/admin/Layout";
import { AdminDashboardOverview } from "@/components/admin/AdminDashboardOverview";
import { UserManagement } from "@/components/admin/UserManagement";
import { AuditLogs } from "@/components/admin/AuditLogs";
import NotFound from "@/pages/NotFound";
import EmployeeManagement from "@/components/admin/EmployeeManagement";
import BuyerManagement from "@/components/admin/BuyerManagement";
import CadDesignDashboard from "@/components/cadDesign/CadDesignDashboard";
import SampleDevelopement from "@/components/SampleRoomDashboard/SampleRoomDashboard";
import FabricBooking from "@/components/fabricBooking/FabricBookingDashboard";
import { MerchandiserDashboard } from "@/components/merchandiser/MerchandiserDashboard";
import SampleTna from "@/components/merchandiser/SampleTna";
import MerchandiserReports from "@/components/merchandiser/Reports";
import ManagementDashboard from "@/components/merchandiser/ManagementDashboard";
import ManagementTrimsPage from "@/components/trims/ManagementTrimsPage";
import TrimsCreatePage from "@/components/trims/TrimsCreatePage";
import TrimsEditPage from "@/components/trims/TrimsEditPage";
import TrimsShowPage from "@/components/trims/TrimsShowPage";
import PublicRoute from "./public/PublicRoute";
import SampleRoomRoutes from "./private/SampleRoomRoutes";
import { useUser } from "@/redux/slices/userSlice";
import { Navigate } from "react-router-dom";
import AdminRoutes from "./private/AdminRoutes";
import MerchandiserRoutes from "./private/MerchandiserRoutes";
import ManagementRoutes from "./private/ManagementRoutes";
import CostSheet from "@/pages/CostSheet";
import CadRoutes from "./private/CadRoutes";
import SampleFabricRoutes from "./private/SampleFabricRoutes";

// Root route protection: redirect to /login if not authenticated
const RootRoute = () => {
  const { user } = useUser();
  if (!user || !user?.role) {
    return <Navigate to={APP_ROUTES.login} replace />;
  }
  // Optionally, redirect to dashboard based on role using centralized helper
  return <Navigate to={getRouteForRole(user.role)} replace />;
};

// Create router with nested routes
export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Public route */}
      <Route
        path={APP_ROUTES.login}
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      {/* Root route: always redirect to login if not authenticated */}
      <Route path="/" element={<RootRoute />} />
      {/* Admin layout + nested routes protected by AdminRoutes */}
      <Route element={<AdminRoutes />}>
        <Route path="admin" element={<Layout sidebarFor={"admin"} />}>
          <Route path="dashboard" element={<AdminDashboardOverview />} />
          <Route path="employee" element={<EmployeeManagement />} />
          <Route path="user" element={<UserManagement />} />
          <Route path="buyer" element={<BuyerManagement />} />
          <Route path="audit" element={<AuditLogs />} />
          <Route path="reports" element={<MerchandiserReports />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>

      {/* Merchandiser layout + nested routes */}
      <Route element={<MerchandiserRoutes />}>
        <Route
          path="merchandiser"
          element={<Layout sidebarFor={"merchandiser"} />}
        >
          <Route path="dashboard" element={<MerchandiserDashboard />} />
          <Route
            path="management-dashboard"
            element={<ManagementDashboard />}
          />
          <Route path="employee" element={<EmployeeManagement />} />
          <Route path="user" element={<UserManagement />} />
          <Route path="tna" element={<SampleTna />} />
          <Route path="audit" element={<AuditLogs />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>

      <Route path="merchandiser" element={<Layout sidebarFor={"cad"} />}>
        {/* <Route path="cad-designs" element={<CadDesignDashboard /   >} /> */}
        <Route path="fabric-booking" element={<FabricBooking />} />
        <Route path="sample-development" element={<SampleDevelopement />} />
        <Route path="reports" element={<MerchandiserReports />} />
        <Route path="cost-sheet" element={<CostSheet />} />
        
      </Route>

      <Route element={<ManagementRoutes />}>
        <Route path="management" element={<Layout sidebarFor={"management"} />}>
          <Route path="dashboard" element={<ManagementDashboard />} />
          <Route path="trims" element={<ManagementTrimsPage />} />
          <Route path="trims/create" element={<TrimsCreatePage />} />
          <Route path="trims/edit/:id" element={<TrimsEditPage />} />
          <Route path="trims/:id" element={<TrimsShowPage />} />
          <Route path="cost-sheet" element={<CostSheet />} />
        </Route>
      </Route>

      <Route element={<ManagementRoutes />}>
        <Route path="employee" element={<EmployeeManagement />} />
        <Route path="cost-sheet" element={<CostSheet />} />
        <Route path="user" element={<UserManagement />} />
      </Route>

      <Route element={<CadRoutes/>}>
        <Route path="cad" element={<Layout sidebarFor="cad"/>}>
          <Route path="dashboard" element={<CadDesignDashboard />} />
        </Route>
      </Route>

      <Route element={<SampleFabricRoutes/>}>
        <Route path="sample-fabric" element={<Layout sidebarFor="sample_fabric"/>}>
          <Route path="dashboard" element={<FabricBooking />} />
        </Route>
      </Route>

      <Route element={<SampleRoomRoutes/>}>
        <Route path="sample-room" element={<Layout sidebarFor={"sample_room"} />}>
          <Route path="dashboard" element={<SampleDevelopement />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </>
  )
);
