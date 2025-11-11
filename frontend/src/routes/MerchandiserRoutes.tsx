import { useUser } from "@/redux/slices/userSlice";
import { Navigate, Outlet } from "react-router-dom";

const MerchandiserRoutes = () => {
  const {user} = useUser();
  return user.role === 'MERCHANDISER' ? <Outlet /> : <Navigate to="/signin" />;
};

export default MerchandiserRoutes;