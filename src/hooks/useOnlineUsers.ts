import { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket";

/**
 * Hook that tracks which users are currently online via Socket.IO presence events.
 * Returns a Set of online user IDs for O(1) lookups.
 */
export function useOnlineUsers() {
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const socket = getSocket();

    const handler = (data: { onlineUserIds: string[] }) => {
      setOnlineUserIds(new Set(data.onlineUserIds));
    };

    socket.on("presence:update", handler);
    return () => {
      socket.off("presence:update", handler);
    };
  }, []);

  return onlineUserIds;
}
