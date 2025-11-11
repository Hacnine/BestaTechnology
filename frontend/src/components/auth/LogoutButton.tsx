import { LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { reset } from "@/redux/slices/userSlice";
import { userApi } from "@/redux/api/userApi";
import { persistor } from "@/redux/store";
import { Button } from "@/components/ui/button";
import { useLogoutMutation } from "@/redux/api/userApi";
import toast from "react-hot-toast";

export function LogoutButton({ collapsed }) {
  const navigate = useNavigate();
  const [logout, { isSuccess }] = useLogoutMutation();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      await logout().unwrap();
      if (isSuccess) {
        toast.success("You have been successfully logged out.");
      }
      navigate("/login");
    } catch (error) {
      toast.error("An error occurred while logging out.");
    }

    dispatch(reset());
    // 3) reset RTK Query caches (replace `rootApi` with your actual api slice export)
    dispatch(userApi.util.resetApiState());
    // 4) if using redux-persist, purge persisted storage
    if (persistor && persistor.purge) {
      await persistor.purge();
    }

    // 5) navigate to login
    navigate("/login");
  };

  return (
    <Button variant="ghost" size="sm" className={`${!collapsed ? "-ml-2" : ""}`} onClick={handleLogout}>
      <LogOut className="h-4 w-4 mr-2" />
      {!collapsed ? "Logout" : ""}
    </Button>
  );
}
