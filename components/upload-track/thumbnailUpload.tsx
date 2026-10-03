"use client"
import { useState } from 'react'
import { Button } from '../ui/button';
import { Trash, UploadSimple } from 'phosphor-react';
import Image from 'next/image';
import { Card, CardContent } from '../ui/card';

interface Params {
  onSelect: (selectedImage: File | null) => void;
}

function ThumbnailUpload({ onSelect }: Params) {
  const [resolvedImage, setResolvedImage] = useState<string | null>(null);
  const [isThumbnailHovered, setIsThumbnailHovered] = useState(false);

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
      console.log('read image');
      setResolvedImage(imageBase64);
    };
  };

  return resolvedImage ?
    <div
      className="w-48! h-48! relative rounded-[6px] overflow-clip"
      onMouseEnter={() => setIsThumbnailHovered(true)}
      onMouseLeave={() => setIsThumbnailHovered(false)}
    >
      {isThumbnailHovered ?
        <Button
          size="icon"
          variant="destructive"
          onClick={() => selectImage(null)}
          className="absolute top-2 left-2 z-10 cursor-pointer bg-foreground/65 hover:bg-foreground/85"
        >
          <Trash weight="fill" />
        </Button> : <></>
      }
      <Image
        src={resolvedImage}
        alt="Selected thumbnail"
        fill={true}
        style={{ objectFit: "cover" }}
      />
    </div> :
    <div className="h-48! w-48! relative">
      <input
        onChange={e => selectImage(e.target?.files?.item(0) ?? null)}
        className="w-48! h-48! absolute opacity-0 z-10 cursor-pointer"
        accept="image/png, image/jpeg"
        type="file"
        name={`thumbnail-input`}
        id={`thumbnail-input`}
      />
      <Card className="w-48! h-48! relative">
        <CardContent className="w-full h-full">
          <div className="w-full h-full flex flex-col items-center justify-center">
            <UploadSimple className="size-8 opacity-50 z-0" />
            <div className="w-full text-center opacity-50">
              Press or drag to select the thumbnail
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
}

export default ThumbnailUpload