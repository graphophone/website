"use client"

import S3Image from "@/components/s3Image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import { Trash, UploadSimple } from "phosphor-react";
import { useEffect, useState } from "react";

interface Params {
  title: string,
  imageSemantics: string,
  imageUrl: string | null;
  handleSave: (selectedImage: File | null) => Promise<void>,
  imageFill?: boolean,
}

function EditProfileImageForm({
  title,
  imageSemantics,
  imageUrl,
  handleSave,
  imageFill,
}: Params) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [resolvedImage, setResolvedImage] = useState<string | null>(imageUrl);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedImage === null) {
      if (resolvedImage !== imageUrl) {
        setResolvedImage(null);
      }
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
  }, [selectedImage]);

  const saveHandlerWrapper = async () => {
    setIsLoading(true);
    await handleSave(selectedImage);
    setIsLoading(false);
  }

  const removeImage = () => {
    setSelectedImage(null);
    setResolvedImage(null);
  }

  const resetImage = () => {
    setResolvedImage(imageUrl);
    setSelectedImage(null);
  }

  const resolvedImageElement = (
    resolvedImage ? (
      resolvedImage !== imageUrl ?
      <Image
        src={resolvedImage}
        alt="Selected image"
        fill={true}
        style={{ objectFit: "cover" }}
      /> : (
        imageUrl ?
          <S3Image
            src={imageUrl}
            alt="Current image"
            fill={true}
            style={{ objectFit: "cover" }}
          /> : <></>
      )
    ) : <></>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4.5 items-center">
          <div className="w-32 h-32 relative">
            <input
              onChange={event => setSelectedImage(event.target.files?.item(0) ?? null)}
              className="w-full h-full absolute opacity-0 z-10 cursor-pointer"
              accept="image/png, image/jpeg"
              type="file"
              name={`${imageSemantics}-input`}
              id={`${imageSemantics}-input`}
            />
            <Card className="w-32 h-32 relative">
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
          { resolvedImage ?
            <div
              className={`h-32 relative rounded-[6px] overflow-clip
                  ${imageFill ? 'w-full' : 'w-32'}`}
              onMouseEnter={() => setIsImageHovered(true)}
              onMouseLeave={() => setIsImageHovered(false)}  
            >
              { isImageHovered ?
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={removeImage}
                  className="absolute top-2 left-2 z-10 cursor-pointer bg-foreground/65 hover:bg-foreground/85"
                >
                  <Trash weight="fill" />
                </Button> : <></>
              }
              { resolvedImageElement }
            </div> : <></>
          }
        </div>
      </CardContent>
      <CardFooter className="w-full flex justify-end gap-2">
        <Button
          onClick={saveHandlerWrapper}
          disabled={resolvedImage === imageUrl}
          className="cursor-pointer"
        >
          { isLoading ?
            <div className="absolute w-full h-full flex items-center justify-center">
              <Spinner />
            </div> : <></>
          }
          <span className={isLoading ? "opacity-0" : ""}>Save</span>
        </Button>
        <Button
          className="cursor-pointer"
          onClick={resetImage}
          variant="outline"
        >
          Reset
        </Button>
      </CardFooter>
    </Card>
  )
}

export default EditProfileImageForm