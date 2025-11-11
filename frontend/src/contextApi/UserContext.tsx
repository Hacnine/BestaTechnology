import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";

import url from "@/config/urls";

// Context Types
interface UserAuthContextType {
  user: User | null;
  socket: Socket | null;
}

interface User {
  _id: string;
  name: string;
  email: string;
  // Add other user fields as needed
}

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const UserAuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const socket = useRef<Socket | null>(null);

  // Replace this with your actual token retrieval logic
  const getAccessToken = (): string | null => {
    return localStorage.getItem("accessToken");
  };

  const initializeSocket = useCallback((currentUser: User) => {
    if (!currentUser || socket.current) return;

    socket.current = io(url.BASE_URL, { withCredentials: true });

    socket.current.emit("userOnline", currentUser._id);
    socket.current.emit("join", `user_${currentUser._id}`);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const token = getAccessToken();
      // if (!token) return;

      try {
        const response = await fetch(`${url.BASE_URL}/user-info`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user info");
        }

        const data = await response.json();
        if (data?.user) {
          setUser(data.user);
          initializeSocket(data.user);
        }
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    };

    fetchUser();

    return () => {
      if (socket.current) {
        socket.current.off("loggedUsersUpdate");
        socket.current.disconnect();
        socket.current = null;
      }
    };
  }, [initializeSocket]);

  return (
    <UserAuthContext.Provider value={{ user, socket: socket.current }}>
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = (): UserAuthContextType => {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error("useUserAuth must be used within a UserAuthProvider");
  }
  return context;
};