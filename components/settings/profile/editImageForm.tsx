"use client"

import S3Image from "@/components/s3Image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Trash, UploadSimple } from "phosphor-react";
import { useState } from "react";

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
  const [isImageHovered, setIsImageHovered] = useState(false);

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

  return resolvedImage ? (
    <div
      className={`h-48 relative rounded-[6px] overflow-clip
        ${imageFill ? "grow" : "w-48 shrink-0"}`}
      onMouseEnter={() => setIsImageHovered(true)}
      onMouseLeave={() => setIsImageHovered(false)}
    >
      {isImageHovered && (
        <Button
          size="icon"
          variant="destructive"
          onClick={() => onChange(null)}
          className="absolute top-2 left-2 z-10 cursor-pointer bg-foreground/65 hover:bg-foreground/85"
        >
          <Trash weight="fill" />
        </Button>
      )}
      {resolvedImageElement}
    </div>
  ) : (
    <div className={`h-48 relative ${imageFill ? "grow" : "w-48 shrink-0"}`}>
      <input
        onChange={event => onChange(event.target.files?.item(0) ?? null)}
        className="w-full h-full absolute opacity-0 z-10 cursor-pointer"
        accept="image/png, image/jpeg"
        type="file"
        name={`${imageSemantics}-input`}
        id={`${imageSemantics}-input`}
      />
      <Card className="w-full h-full relative">
        <CardContent className="w-full h-full">
          <div className="w-full h-full flex flex-col items-center justify-center">
            <UploadSimple className="size-8 opacity-50 z-0" />
            <div className="w-full text-center opacity-50">
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
      <div className="w-full flex gap-4.5">
        <div className="w-48 shrink-0 flex flex-col gap-2">
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
