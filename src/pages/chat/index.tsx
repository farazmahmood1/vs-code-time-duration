import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  type ChatUser,
  type Conversation,
  type Message,
  useConversations,
  useCreateConversation,
  useMarkAsRead,
  useMessages,
  useSearchChatUsers,
  useSendMessage,
} from "@/hooks/useChat";
import { useSession } from "@/lib/auth-client";
import { getSocket } from "@/lib/socket";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Loader2, MessageSquarePlus, Send } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export default function ChatPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { data: conversations, isLoading, refetch: refetchConversations } = useConversations();
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const {
    data: messagesData,
    refetch: refetchMessages,
  } = useMessages(activeConvId);
  const sendMessage = useSendMessage();
  const markAsRead = useMarkAsRead();
  const createConversation = useCreateConversation();

  const [input, setInput] = useState("");
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const { data: searchResults, isLoading: isSearching } = useSearchChatUsers(searchEmail);
  const [typingUsers, setTypingUsers] = useState<Record<string, string>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const messages = messagesData?.data || [];
  const activeConv = conversations?.find((c) => c.id === activeConvId);

  // Socket.IO real-time events
  useEffect(() => {
    const socket = getSocket();

    const onMessage = (payload: {
      conversationId: string;
      message: Message;
    }) => {
      if (payload.conversationId === activeConvId) {
        refetchMessages();
      }
      refetchConversations();
    };

    const onTyping = (payload: {
      conversationId: string;
      userId: string;
      userName: string;
    }) => {
      if (payload.userId !== userId) {
        setTypingUsers((prev) => ({
          ...prev,
          [payload.userId]: payload.userName,
        }));
      }
    };

    const onStopTyping = (payload: {
      conversationId: string;
      userId: string;
    }) => {
      setTypingUsers((prev) => {
        const next = { ...prev };
        delete next[payload.userId];
        return next;
      });
    };

    socket.on("chat:message", onMessage);
    socket.on("chat:typing", onTyping);
    socket.on("chat:stopTyping", onStopTyping);

    return () => {
      socket.off("chat:message", onMessage);
      socket.off("chat:typing", onTyping);
      socket.off("chat:stopTyping", onStopTyping);
    };
  }, [activeConvId, userId, refetchMessages, refetchConversations]);

  // Join/leave socket rooms when active conversation changes
  useEffect(() => {
    if (!activeConvId) return;
    const socket = getSocket();
    socket.emit("chat:join", activeConvId);
    markAsRead.mutate(activeConvId);
    return () => {
      socket.emit("chat:leave", activeConvId);
    };
  }, [activeConvId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = useCallback(() => {
    if (!input.trim() || !activeConvId) return;
    sendMessage.mutate({ conversationId: activeConvId, content: input.trim() });
    setInput("");
    const socket = getSocket();
    socket.emit("chat:stopTyping", { conversationId: activeConvId });
  }, [input, activeConvId, sendMessage]);

  const handleInputChange = (val: string) => {
    setInput(val);
    if (!activeConvId) return;
    const socket = getSocket();
    socket.emit("chat:typing", { conversationId: activeConvId });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("chat:stopTyping", { conversationId: activeConvId });
    }, 2000);
  };

  const handleNewChat = () => {
    if (!selectedUser) return;
    createConversation.mutate(
      { participantIds: [selectedUser.id] },
      {
        onSuccess: (conv) => {
          setActiveConvId(conv.id);
          setNewChatOpen(false);
          setSearchEmail("");
          setSelectedUser(null);
        },
      }
    );
  };

  const getConvName = (conv: Conversation) => {
    if (conv.name) return conv.name;
    if (conv.type === "DIRECT") {
      const other = conv.participants.find((p) => p.userId !== userId);
      return other?.user?.name || "Unknown";
    }
    return conv.participants.map((p) => p.user.name).join(", ");
  };

  const getConvAvatar = (conv: Conversation) => {
    if (conv.type === "DIRECT") {
      const other = conv.participants.find((p) => p.userId !== userId);
      return other?.user;
    }
    return null;
  };

  const typingNames = Object.values(typingUsers);

  return (
    <div className="flex h-[calc(100vh-7rem)] border rounded-lg overflow-hidden">
      {/* Sidebar — Conversation List */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-3 border-b flex items-center justify-between">
          <h2 className="font-semibold text-lg">Messages</h2>
          <Dialog open={newChatOpen} onOpenChange={setNewChatOpen}>
            <DialogTrigger asChild>
              <Button size="icon" variant="ghost">
                <MessageSquarePlus className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Conversation</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Input
                  placeholder="Search by name or email..."
                  value={searchEmail}
                  onChange={(e) => {
                    setSearchEmail(e.target.value);
                    setSelectedUser(null);
                  }}
                  autoFocus
                />
                {selectedUser ? (
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={selectedUser.image || ""} />
                      <AvatarFallback>
                        {selectedUser.name
                          .split(" ")
                          .map((w) => w[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{selectedUser.name}</div>
                      <div className="text-xs text-muted-foreground">{selectedUser.email}</div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedUser(null);
                        setSearchEmail("");
                      }}
                    >
                      Change
                    </Button>
                  </div>
                ) : searchEmail.length >= 2 ? (
                  <div className="border rounded-lg max-h-48 overflow-y-auto">
                    {isSearching ? (
                      <div className="flex justify-center p-4">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    ) : !searchResults?.length ? (
                      <div className="p-3 text-sm text-muted-foreground text-center">
                        No users found
                      </div>
                    ) : (
                      searchResults.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => {
                            setSelectedUser(user);
                            setSearchEmail(user.name);
                          }}
                          className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 text-left transition-colors"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.image || ""} />
                            <AvatarFallback className="text-xs">
                              {user.name
                                .split(" ")
                                .map((w) => w[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="font-medium text-sm truncate">{user.name}</div>
                            <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Type at least 2 characters to search for a person.
                  </p>
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setNewChatOpen(false);
                    setSearchEmail("");
                    setSelectedUser(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleNewChat}
                  disabled={!selectedUser || createConversation.isPending}
                >
                  {createConversation.isPending && (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  )}
                  Start Chat
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <ScrollArea className="flex-1">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : !conversations?.length ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No conversations yet.
            </div>
          ) : (
            conversations.map((conv) => {
              const avatar = getConvAvatar(conv);
              const lastMsg = conv.messages[0];
              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 hover:bg-muted/50 text-left transition-colors",
                    activeConvId === conv.id && "bg-muted"
                  )}
                >
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={avatar?.image || ""} />
                    <AvatarFallback>
                      {getConvName(conv)
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm truncate">
                        {getConvName(conv)}
                      </span>
                      {lastMsg && (
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(lastMsg.createdAt), "HH:mm")}
                        </span>
                      )}
                    </div>
                    {lastMsg && (
                      <p className="text-xs text-muted-foreground truncate">
                        {lastMsg.sender?.name?.split(" ")[0]}:{" "}
                        {lastMsg.content.slice(0, 40)}
                      </p>
                    )}
                  </div>
                  {conv.unreadCount > 0 && (
                    <Badge
                      variant="default"
                      className="h-5 w-5 flex items-center justify-center rounded-full p-0 text-[10px]"
                    >
                      {conv.unreadCount}
                    </Badge>
                  )}
                </button>
              );
            })
          )}
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {!activeConvId ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a conversation to start chatting
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-3 border-b flex items-center gap-3">
              {activeConv && (
                <>
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={getConvAvatar(activeConv)?.image || ""}
                    />
                    <AvatarFallback>
                      {getConvName(activeConv)
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">
                      {getConvName(activeConv)}
                    </div>
                    {activeConv.type === "GROUP" && (
                      <div className="text-xs text-muted-foreground">
                        {activeConv.participants.length} members
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {messages.map((msg) => {
                  const isMe = msg.senderId === userId;
                  return (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex gap-2",
                        isMe ? "justify-end" : "justify-start"
                      )}
                    >
                      {!isMe && (
                        <Avatar className="h-7 w-7 mt-1">
                          <AvatarImage src={msg.sender?.image || ""} />
                          <AvatarFallback className="text-[10px]">
                            {msg.sender?.name
                              ?.split(" ")
                              .map((w) => w[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={cn(
                          "max-w-[65%] rounded-lg px-3 py-2 text-sm",
                          isMe
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}
                      >
                        {!isMe && activeConv?.type === "GROUP" && (
                          <div className="text-xs font-medium mb-1 opacity-70">
                            {msg.sender?.name}
                          </div>
                        )}
                        <p className="whitespace-pre-wrap break-words">
                          {msg.content}
                        </p>
                        <div
                          className={cn(
                            "text-[10px] mt-1",
                            isMe ? "text-primary-foreground/60" : "text-muted-foreground"
                          )}
                        >
                          {format(new Date(msg.createdAt), "HH:mm")}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Typing indicator */}
            {typingNames.length > 0 && (
              <div className="px-4 pb-1 text-xs text-muted-foreground italic">
                {typingNames.join(", ")}{" "}
                {typingNames.length === 1 ? "is" : "are"} typing...
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t flex gap-2">
              <Input
                placeholder="Type a message..."
                value={input}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className="flex-1"
              />
              <Button
                size="icon"
                onClick={handleSend}
                disabled={!input.trim() || sendMessage.isPending}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
