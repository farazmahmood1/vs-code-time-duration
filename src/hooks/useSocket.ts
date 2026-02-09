import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket, connectSocket, disconnectSocket } from "@/lib/socket";
import { useSession } from "@/lib/auth-client";

/**
 * Initialize socket connection when user is authenticated.
 * Call this once at the app level (e.g., in AppLayout or App.tsx).
 */
export function useSocketConnection() {
  const { data: session } = useSession();
  const isConnected = useRef(false);

  useEffect(() => {
    if (session?.user && !isConnected.current) {
      connectSocket();
      isConnected.current = true;
    }

    return () => {
      if (isConnected.current) {
        disconnectSocket();
        isConnected.current = false;
      }
    };
  }, [session?.user]);
}

/**
 * Subscribe to a socket event and invalidate React Query cache keys.
 * This is the primary hook for making data "real-time".
 */
export function useSocketQueryInvalidation(
  event: string,
  queryKeys: string[][]
) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = getSocket();

    const handler = () => {
      queryKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    };

    socket.on(event, handler);
    return () => {
      socket.off(event, handler);
    };
  }, [event, queryKeys, queryClient]);
}

/**
 * Subscribe to a socket event with a custom callback.
 */
export function useSocketEvent<T = unknown>(
  event: string,
  callback: (data: T) => void
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const socket = getSocket();

    const handler = (data: T) => {
      callbackRef.current(data);
    };

    socket.on(event, handler);
    return () => {
      socket.off(event, handler);
    };
  }, [event]);
}
