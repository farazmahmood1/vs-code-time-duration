import ResponsiveDialog from "@/components/ResponsiveDialog";
import { UserAvatar } from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/button";
import api, { type ApiError } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Camera, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import ReactImageCrop, { type Crop, type PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

// import 'react-image-crop/src/ReactCrop.scss'
import { toast } from "sonner";

interface ProfileHeaderProps {
  name: string;
  email: string;
  department: string;
  avatarUrl?: string;
  onAvatarUpdate?: (newUrl: string) => void;
}

interface UploadResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string;
    department: string;
  };
}

export const ProfileHeader = ({
  name,
  email,
  department,
  avatarUrl,
  onAvatarUpdate,
}: ProfileHeaderProps) => {
  const [avatar, setAvatar] = useState(avatarUrl);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 50,
    height: 50,
    x: 25,
    y: 25,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("image", file);

      const res = await api.post<UploadResponse>(
        "/user/upload-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data;
    },
    onSuccess: (data) => {
      setAvatar(data.user.image);
      toast.success("Avatar updated successfully");
      setPreviewOpen(false);
      setPreviewImage(null);
      setCrop({
        unit: "%",
        width: 50,
        height: 50,
        x: 25,
        y: 25,
      });
      onAvatarUpdate?.(data.user.image);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error: ApiError) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to upload avatar";
      toast.error(errorMessage);
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024)
      return toast.error("File must be less than 5MB");

    if (!file.type.startsWith("image/"))
      return toast.error("Invalid image selected");

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
      setPreviewOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const getCroppedImage = async (): Promise<File | null> => {
    if (!completedCrop || !imgRef.current) return null;

    const canvas = document.createElement("canvas");
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

    // Ensure perfect square by using the smaller dimension
    const size = Math.min(completedCrop.width, completedCrop.height);

    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      size * scaleX,
      size * scaleY,
      0,
      0,
      size,
      size
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
          resolve(file);
        } else {
          resolve(null);
        }
      }, "image/jpeg");
    });
  };

  const handleConfirmUpload = async () => {
    const croppedFile = await getCroppedImage();
    if (croppedFile) {
      uploadMutation.mutate(croppedFile);
    }
  };

  const handleCancel = () => {
    setPreviewOpen(false);
    setPreviewImage(null);
    setCrop({
      unit: "%",
      width: 50,
      height: 50,
      x: 25,
      y: 25,
    });
    setCompletedCrop(null);
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <>
      <div className="rounded-xl border bg-card/30 backdrop-blur-sm p-8 flex items-center gap-8 max-w-2xl">
        <div className="relative">
          <UserAvatar
            src={avatar}
            alt={name}
            initials={getInitials(name)}
            size="xl"
            className="border border-border shadow-sm"
            imageClassName="object-cover"
            fallbackClassName="bg-muted"
          />

          <label
            htmlFor="avatar-upload"
            className="absolute bottom-0 right-0 w-9 h-9 flex items-center justify-center bg-primary text-white rounded-full cursor-pointer shadow-md hover:scale-105 transition"
          >
            <Camera className="w-4 h-4" />
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
              disabled={uploadMutation.isPending}
            />
          </label>
        </div>

        <div className="space-y-1">
          <h2 className="text-3xl font-semibold tracking-tight">{name}</h2>
          <p className="text-muted-foreground">{email}</p>

          <span className="inline-flex items-center text-sm px-3 py-1 mt-2 rounded-md bg-muted font-medium">
            {department}
          </span>
        </div>
      </div>

      {/* Avatar Crop Dialog */}
      <ResponsiveDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        title="Crop Avatar"
        description="Adjust and crop your avatar image"
      >
        <div className="space-y-4">
          {previewImage && (
            <div className="flex justify-center">
              <ReactImageCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                circularCrop
                minWidth={100}
                minHeight={100}
              >
                <img
                  ref={imgRef}
                  src={previewImage}
                  alt="Crop preview"
                  className="max-w-full max-h-96"
                />
              </ReactImageCrop>
            </div>
          )}

          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={uploadMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmUpload}
              disabled={uploadMutation.isPending}
            >
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload Avatar"
              )}
            </Button>
          </div>
        </div>
      </ResponsiveDialog>
    </>
  );
};
