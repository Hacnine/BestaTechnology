import ErrorFallback from "@/components/common/ErrorFallback";
import Loading from "@/components/common/Loading";
import { useUser } from "@/redux/slices/userSlice";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoutes = () => {
  const { user, isAuthenticated ,loading } = useUser();

  if (loading) return <Loading />;
  if (!isAuthenticated) return <Navigate to="/login" />;

  const allowedRoles = ["ADMIN"];
  if (!allowedRoles.includes(user.role)) {
    return <ErrorFallback />;
  }

  return <Outlet />;
};

export default AdminRoutes;
