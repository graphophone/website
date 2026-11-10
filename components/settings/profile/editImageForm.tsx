"use client"

import S3Image from "@/components/s3Image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Trash, UploadSimple } from "phosphor-react";
import { cn } from "@/lib/utils";

interface ImageEditorProps {
  imageSemantics: string;
  imageUrl: string | null;
  imageFill?: boolean;
  onChange: (image: File | null) => void;
  resolvedImage: string | null;
}

function ImageEditor({
  imageSemantics,
  imageUrl,
  imageFill,
  onChange,
  resolvedImage,
}: ImageEditorProps) {
  const resolvedImageElement = resolvedImage ? (
    resolvedImage === imageUrl ? (
      <S3Image
        src={resolvedImage}
        alt={`Current ${imageSemantics}`}
        fill
        style={{ objectFit: "cover" }}
      />
    ) : (
      <Image
        src={resolvedImage}
        alt={`Selected ${imageSemantics}`}
        fill
        style={{ objectFit: "cover" }}
      />
    )
  ) : null;

  const imageSizeClassName = imageFill ? "w-full h-28 md:h-48" : "size-28 md:size-48 shrink-0";

  return resolvedImage ? (
    <div className="flex flex-col gap-2">
      <div className={cn("group relative rounded-[6px] overflow-clip", imageSizeClassName)}>
        <Button
          type="button"
          size="icon"
          variant="destructive"
          onClick={() => onChange(null)}
          aria-label={`Remove ${imageSemantics}`}
          className="absolute top-2 left-2 z-10 hidden md:group-hover:inline-flex cursor-pointer bg-foreground/65 hover:bg-foreground/85"
        >
          <Trash weight="fill" />
        </Button>
        {resolvedImageElement}
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={() => onChange(null)}
        className="md:hidden w-fit cursor-pointer text-destructive"
      >
        <Trash weight="fill" />
        Remove image
      </Button>
    </div>
  ) : (
    <div className={cn("relative", imageSizeClassName)}>
      <input
        onChange={event => onChange(event.target.files?.item(0) ?? null)}
        className="w-full h-full absolute opacity-0 z-10 cursor-pointer"
        accept="image/png, image/jpeg"
        type="file"
        name={`${imageSemantics}-input`}
        id={`${imageSemantics}-input`}
      />
      <Card className="w-full h-full relative py-2 md:py-4">
        <CardContent className="w-full h-full px-2 md:px-4">
          <div className="w-full h-full flex flex-col items-center justify-center gap-1">
            <UploadSimple className="size-5 md:size-8 opacity-50 z-0" />
            <div className="md:hidden w-full text-center text-xs opacity-50">
              Press to select the {imageSemantics}
            </div>
            <div className="hidden md:block w-full text-center opacity-50">
              Press or drag to select the {imageSemantics}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface Props {
  avatarUrl: string | null;
  bannerUrl: string | null;
  resolvedAvatar: string | null;
  resolvedBanner: string | null;
  onAvatarChange: (image: File | null) => void;
  onBannerChange: (image: File | null) => void;
}

function EditProfileImageForm({
  avatarUrl,
  bannerUrl,
  resolvedAvatar,
  resolvedBanner,
  onAvatarChange,
  onBannerChange,
}: Props) {
  return (
    <CardContent>
      <div className="w-full flex flex-col md:flex-row gap-4.5">
        <div className="w-fit shrink-0 flex flex-col gap-2">
          <div>Avatar</div>
          <ImageEditor
            imageSemantics="avatar"
            imageUrl={avatarUrl}
            onChange={onAvatarChange}
            resolvedImage={resolvedAvatar}
          />
        </div>
        <div className="grow flex flex-col gap-2">
          <div>Banner</div>
          <ImageEditor
            imageSemantics="banner"
            imageUrl={bannerUrl}
            imageFill
            onChange={onBannerChange}
            resolvedImage={resolvedBanner}
          />
        </div>
      </div>
    </CardContent>
  );
}

export default EditProfileImageForm;
