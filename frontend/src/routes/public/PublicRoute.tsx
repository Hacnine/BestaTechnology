import { useUser } from "@/redux/slices/userSlice";
import { Navigate } from "react-router-dom";
import { getRouteForRole } from "@/routes/roleRoutes";

const PublicRoute = ({ children }) => {
  const { user } = useUser();

  // If user is logged in, redirect them to their role's dashboard
  if (user && user.role) {
    return <Navigate to={getRouteForRole(user.role)} />;
  }

  return children;
};

export default PublicRoute;
