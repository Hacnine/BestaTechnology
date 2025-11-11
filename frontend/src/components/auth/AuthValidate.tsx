import { useEffect } from "react";
import { useUserInfoQuery } from "@/redux/api/userApi";
import { useDispatch } from "react-redux";
import { logout, setCredentials } from "@/redux/slices/userSlice";

// This component runs a userInfo query on mount to validate token and user.
// On 401/403 the userApi baseQuery will already dispatch logout. If the
// server returns user data, ensure state is up-to-date.
export default function AuthValidate() {
  const { data, error, isError } = useUserInfoQuery(undefined, { skip: false });
  const dispatch = useDispatch();

  useEffect(() => {
    if (data && data.user) {
      // update credentials in case of rehydration or mismatch
      dispatch(setCredentials({ user: data.user } as any));
    }
    if (isError && error) {
      // if server indicates not authorized, dispatch logout (baseQuery also handles it)
      dispatch(logout());
    }
  }, [data, isError, error, dispatch]);

  return null;
}
