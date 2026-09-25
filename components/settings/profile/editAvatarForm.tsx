"use client"

import S3Image from "@/components/s3Image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { editAvatarEndpoint } from "@/constants/api";
import { UserContext } from "@/context/userContext";
import Image from "next/image";
import { Trash, UploadSimple } from "phosphor-react";
import { useContext, useEffect, useState } from "react";

interface Params {
  avatarUrl: string | null;
}

function EditAvatarForm({ avatarUrl }: Params) {
  const userContext = useContext(UserContext);
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [resolvedAvatar, setResolvedAvatar] = useState<string | null>(null);
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);

  useEffect(() => {
    if (selectedAvatar === null) {
      setResolvedAvatar(null);
      return;
    }
    const fileReader = new FileReader();
    fileReader.readAsDataURL(selectedAvatar);
    fileReader.onload = () => {
      const imageBase64 = fileReader.result;
      if (imageBase64 instanceof ArrayBuffer) {
        console.warn('Image is array buffer ...');
      } else {
        setResolvedAvatar(imageBase64);
      }
    };
  }, [selectedAvatar]);

  const handleEditAvatar = async () => {
    let body = null;
    if (selectedAvatar !== null) {
      const formData = new FormData();
      formData.append('avatar', selectedAvatar);
      body = formData;
    }
    const res = await userContext.protectedFetch(editAvatarEndpoint, {
      method: "PUT",
      body,
    });

    if (res.status !== 200) {
      console.error(res);
    }
  };

  const resolvedAvatarElement = (
    resolvedAvatar ?
      <Image
        src={resolvedAvatar}
        alt="Your current avatar"
        fill={true}
        style={{ objectFit: "cover" }}
      /> : (
        avatarUrl ?
          <S3Image
            src={avatarUrl}
            alt="Your current avatar"
            fill={true}
            style={{ objectFit: "cover" }}
          /> : <></>
      )
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Avatar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4.5 items-center">
          <div className="w-32 h-32 relative">
            <input
              onChange={event => setSelectedAvatar(event.target.files?.item(0) ?? null)}
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
          { (resolvedAvatar ?? avatarUrl) ?
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
              {resolvedAvatarElement}
            </div> : <></>
          }
        </div>
      </CardContent>
      <CardFooter className="w-full flex justify-end gap-2">
        <Button
          onClick={handleEditAvatar}
          disabled={selectedAvatar === null}
          className="cursor-pointer"
        >
          Save
        </Button>
        <Button
          className="cursor-pointer"
          onClick={() => setSelectedAvatar(null)}
          variant="outline"
        >
          Reset
        </Button>
      </CardFooter>
    </Card>
  )
}

export default EditAvatarForm