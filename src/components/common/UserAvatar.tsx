import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  src?: string | null;
  alt?: string;
  initials?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  fallbackClassName?: string;
  imageClassName?: string;
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-16 w-16",
  xl: "h-24 w-24",
};

const fallbackTextSizes = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
  xl: "text-3xl",
};

/**
 * Global UserAvatar component for consistent avatar display throughout the app
 * Handles image loading with initials fallback
 *
 * @example
 * // Basic usage with image
 * <UserAvatar src={user.image} alt={user.name} initials="JD" />
 *
 * // With custom size
 * <UserAvatar src={user.image} alt={user.name} initials="JD" size="lg" />
 *
 * // With custom styling
 * <UserAvatar src={user.image} initials="AB" className="border-2 border-blue-500" />
 */
export const UserAvatar = ({
  src,
  alt = "User avatar",
  initials = "?",
  size = "md",
  className,
  fallbackClassName,
  imageClassName,
}: UserAvatarProps) => {
  // If src is actually initials text (not a URL), use it as fallback
  const imageUrl =
    src &&
    typeof src === "string" &&
    (src.startsWith("http") || src.startsWith("/"))
      ? src
      : undefined;
  const fallbackInitials = !imageUrl && src ? src : initials;

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage src={imageUrl} alt={alt} className={imageClassName} />
      <AvatarFallback
        className={cn(
          "font-semibold",
          fallbackTextSizes[size],
          fallbackClassName
        )}
      >
        {fallbackInitials}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
