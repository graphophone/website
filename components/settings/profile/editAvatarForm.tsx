"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Trash, UploadSimple } from "phosphor-react";
import { useState } from "react";

interface Params {
  avatarUrl: string | null;
}

function EditAvatarForm({ avatarUrl }: Params) {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(avatarUrl);
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);

  const handleInputAvatar = (image: File | null) => {
    if (image === null) {
      setSelectedAvatar(null);
      return;
    }

    const fileReader = new FileReader();
    fileReader.readAsDataURL(image);
    fileReader.onload = () => {
      const imageBase64 = fileReader.result;
      if (imageBase64 instanceof ArrayBuffer) {
        console.log('Image is array buffer ...');
      } else {
        setSelectedAvatar(imageBase64);
      }
    };
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Avatar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4.5 items-center">
          <div className="w-32 h-32 relative">
            <input
              onChange={event => handleInputAvatar(event.target.files?.item(0) ?? null)}
              className="w-full h-full absolute opacity-0 z-10 cursor-pointer"
              accept="image/png, image/jpeg"
              type="file"
              name="avatar-input"
              id="avatar-input"
            />
            <Card className="w-32 h-32 relative">
              <CardContent className="w-full h-full">
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <UploadSimple className="size-8 opacity-50 z-0" />
                  <div className="w-full text-center opacity-50">
                    Press or drag to select the avatar
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          { selectedAvatar ?
            <div
              className="w-32 h-32 relative rounded-[6px] overflow-clip"
              onMouseEnter={() => setIsAvatarHovered(true)}
              onMouseLeave={() => setIsAvatarHovered(false)}  
            >
              { isAvatarHovered ?
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => setSelectedAvatar(null)}
                  className="absolute top-2 left-2 z-10 cursor-pointer"
                >
                  <Trash weight="fill" />
                </Button> : <></>
              }
              <Image
                src={selectedAvatar}
                alt="Your current avatar"
                fill={true}
                style={{ objectFit: "cover" }}
              />
            </div> : <></>
          }
        </div>
      </CardContent>
      <CardFooter className="w-full flex justify-end gap-2">
        <Button
          disabled={selectedAvatar === avatarUrl}
          className="cursor-pointer"
        >
          Save
        </Button>
        <Button
          className="cursor-pointer"
          onClick={() => setSelectedAvatar(avatarUrl)}
          variant="outline"
        >
          Reset
        </Button>
      </CardFooter>
    </Card>
  )
}

export default EditAvatarForm