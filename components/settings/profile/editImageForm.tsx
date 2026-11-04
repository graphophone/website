"use client"

import S3Image from "@/components/s3Image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import { Trash, UploadSimple } from "phosphor-react";
import { useEffect, useState } from "react";

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
  handleSaveAvatar: (selectedImage: File | null) => Promise<boolean>;
  handleSaveBanner: (selectedImage: File | null) => Promise<boolean>;
}

function EditProfileImageForm({
  avatarUrl,
  bannerUrl,
  handleSaveAvatar,
  handleSaveBanner,
}: Props) {
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [selectedBanner, setSelectedBanner] = useState<File | null>(null);
  const [savedAvatar, setSavedAvatar] = useState<string | null>(avatarUrl);
  const [savedBanner, setSavedBanner] = useState<string | null>(bannerUrl);
  const [resolvedAvatar, setResolvedAvatar] = useState<string | null>(avatarUrl);
  const [resolvedBanner, setResolvedBanner] = useState<string | null>(bannerUrl);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!selectedAvatar) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.readAsDataURL(selectedAvatar);
    fileReader.onload = () => {
      const imageBase64 = fileReader.result;
      if (typeof imageBase64 === "string") {
        setResolvedAvatar(imageBase64);
      }
    };
  }, [selectedAvatar]);

  useEffect(() => {
    if (!selectedBanner) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.readAsDataURL(selectedBanner);
    fileReader.onload = () => {
      const imageBase64 = fileReader.result;
      if (typeof imageBase64 === "string") {
        setResolvedBanner(imageBase64);
      }
    };
  }, [selectedBanner]);

  const hasChanges = resolvedAvatar !== savedAvatar || resolvedBanner !== savedBanner;

  const handleSave = async () => {
    setIsLoading(true);
    const [avatarSaved, bannerSaved] = await Promise.all([
      resolvedAvatar !== savedAvatar
        ? handleSaveAvatar(selectedAvatar)
        : Promise.resolve(true),
      resolvedBanner !== savedBanner
        ? handleSaveBanner(selectedBanner)
        : Promise.resolve(true),
    ]);

    if (avatarSaved) {
      setSavedAvatar(resolvedAvatar);
      setSelectedAvatar(null);
    }
    if (bannerSaved) {
      setSavedBanner(resolvedBanner);
      setSelectedBanner(null);
    }
    setIsLoading(false);
  };

  const resetImages = () => {
    setResolvedAvatar(savedAvatar);
    setResolvedBanner(savedBanner);
    setSelectedAvatar(null);
    setSelectedBanner(null);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Profile images</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full flex gap-4.5">
          <div className="w-48 shrink-0 flex flex-col gap-2">
            <div>Avatar</div>
            <ImageEditor
              imageSemantics="avatar"
              imageUrl={avatarUrl}
              onChange={image => {
                setSelectedAvatar(image);
                setResolvedAvatar(image ? resolvedAvatar : null);
              }}
              resolvedImage={resolvedAvatar}
            />
          </div>
          <div className="grow flex flex-col gap-2">
            <div>Banner</div>
            <ImageEditor
              imageSemantics="banner"
              imageUrl={bannerUrl}
              imageFill
              onChange={image => {
                setSelectedBanner(image);
                setResolvedBanner(image ? resolvedBanner : null);
              }}
              resolvedImage={resolvedBanner}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="w-full flex justify-end gap-2">
        <Button
          onClick={handleSave}
          disabled={!hasChanges || isLoading}
          className="cursor-pointer relative"
        >
          {isLoading && (
            <div className="absolute w-full h-full flex items-center justify-center">
              <Spinner />
            </div>
          )}
          <span className={isLoading ? "opacity-0" : ""}>Save</span>
        </Button>
        <Button
          className="cursor-pointer"
          onClick={resetImages}
          variant="outline"
          disabled={isLoading}
        >
          Reset
        </Button>
      </CardFooter>
    </Card>
  );
}

export default EditProfileImageForm;
