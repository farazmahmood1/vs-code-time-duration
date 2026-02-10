import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface ChatUser {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export interface Participant {
  id: string;
  conversationId: string;
  userId: string;
  user: ChatUser;
  lastReadAt?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  sender: ChatUser;
  content: string;
  isEdited: boolean;
  editedAt?: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  type: "DIRECT" | "GROUP";
  name?: string;
  participants: Participant[];
  messages: Message[]; // last message
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export const useConversations = () =>
  useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const { data } = await api.get("/chat/conversations");
      return data.data as Conversation[];
    },
    refetchInterval: 30000, // fallback polling every 30s
  });

export const useMessages = (
  conversationId: string | null,
  params?: { page?: number }
) =>
  useQuery({
    queryKey: ["messages", conversationId, params],
    queryFn: async () => {
      const sp = new URLSearchParams();
      if (params?.page) sp.set("page", String(params.page));
      const { data } = await api.get(
        `/chat/conversations/${conversationId}/messages?${sp.toString()}`
      );
      return data as {
        data: Message[];
        meta: { page: number; total: number; totalPages: number };
      };
    },
    enabled: !!conversationId,
    refetchInterval: 10000, // fallback polling
  });

export function useCreateConversation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (d: {
      participantIds: string[];
      name?: string;
      type?: "DIRECT" | "GROUP";
    }) => {
      const { data } = await api.post("/chat/conversations", d);
      return data.data as Conversation;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useSendMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      conversationId,
      content,
    }: {
      conversationId: string;
      content: string;
    }) => {
      const { data } = await api.post(
        `/chat/conversations/${conversationId}/messages`,
        { content }
      );
      return data.data as Message;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({
        queryKey: ["messages", vars.conversationId],
      });
      qc.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export const useSearchChatUsers = (query: string) =>
  useQuery({
    queryKey: ["chat-users-search", query],
    queryFn: async () => {
      const { data } = await api.get(`/chat/users/search?q=${encodeURIComponent(query)}`);
      return data.data as ChatUser[];
    },
    enabled: query.length >= 2,
    staleTime: 10000,
  });

export function useMarkAsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (conversationId: string) => {
      await api.patch(`/chat/conversations/${conversationId}/read`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}
