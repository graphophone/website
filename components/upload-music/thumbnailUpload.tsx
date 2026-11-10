"use client"
import { useState } from 'react'
import { Button } from '../ui/button';
import { Trash, UploadSimple } from 'phosphor-react';
import Image from 'next/image';
import { Card, CardContent } from '../ui/card';
import S3Image from '../s3Image';

interface Props {
  initialImage?: string;
  onSelect: (selectedImage: File | null) => void;
}

function ThumbnailUpload({ initialImage, onSelect }: Props) {
  const [resolvedImage, setResolvedImage] = useState<string | null>(initialImage ?? null);

  const selectImage = (selectedImage: File | null) => {
    onSelect(selectedImage);
    if (selectedImage === null) {
      setResolvedImage(null);
      return;
    }
    const fileReader = new FileReader();
    fileReader.readAsDataURL(selectedImage);
    fileReader.onload = () => {
      let imageBase64 = fileReader.result;
      if (imageBase64 instanceof ArrayBuffer) {
        imageBase64 = btoa(String.fromCharCode(...new Uint8Array(imageBase64)));
      }
      setResolvedImage(imageBase64);
    };
  };

  return (
    <div className="flex flex-col gap-2">
      {resolvedImage ?
        <div className="group size-36 md:size-48 relative rounded-[6px] overflow-clip">
          <Button
            type="button"
            size="icon"
            variant="destructive"
            onClick={() => selectImage(null)}
            aria-label="Remove thumbnail"
            className="absolute top-2 left-2 z-10 hidden md:group-hover:inline-flex cursor-pointer bg-foreground/65 hover:bg-foreground/85"
          >
            <Trash weight="fill" />
          </Button>
          {resolvedImage === initialImage ? (
            <S3Image
              src={resolvedImage}
              alt="Current thumbnail"
              fill={true}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <Image
              src={resolvedImage}
              alt="Selected thumbnail"
              fill={true}
              style={{ objectFit: "cover" }}
            />
          )}
        </div> :
        <div className="size-36 md:size-48 relative">
          <input
            onChange={e => selectImage(e.target?.files?.item(0) ?? null)}
            className="size-full absolute opacity-0 z-10 cursor-pointer"
            accept="image/png, image/jpeg"
            type="file"
            name={`thumbnail-input`}
            id={`thumbnail-input`}
          />
          <Card className="size-full relative">
            <CardContent className="w-full h-full px-2 md:px-4">
              <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                <UploadSimple className="size-6 md:size-8 opacity-50 z-0" />
                <div className="md:hidden w-full text-center text-xs opacity-50">
                  Press to select the thumbnail
                </div>
                <div className="hidden md:block w-full text-center opacity-50">
                  Press or drag to select the thumbnail
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      }
      {resolvedImage && (
        <Button
          type="button"
          variant="outline"
          onClick={() => selectImage(null)}
          className="md:hidden w-fit cursor-pointer text-destructive"
        >
          <Trash weight="fill" />
          Remove image
        </Button>
      )}
    </div>
  );
}

export default ThumbnailUpload