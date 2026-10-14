"use client";

import React, { createContext, useContext } from "react";
import { UserContext } from "./userContext";
import { isRequestError } from "@/lib/error";

interface ImageUploadEndpoints {
  requestUploadEndpoint: string,
  notifyUploadEndpoint: string,
  removeEndpoint: string,
}

type ImageUploadError = "request_upload_fail" | "upload_fail" | "notify_upload_fail" | "remove_fail";

export interface IAssetContext {
  uploadImage: (endpoints: ImageUploadEndpoints, image: File | null) => Promise<ImageUploadError | null>,
}

export const AssetContext = createContext<IAssetContext>({
  uploadImage: function (endpoints: ImageUploadEndpoints, image: File | null): Promise<ImageUploadError | null> {
    throw new Error("Function not implemented.");
  }
});

export function AssetContextProvider({ children }: { children: React.ReactNode }) {
  const userContext = useContext(UserContext);

  const uploadImage = async (
    endpoints: ImageUploadEndpoints,
    image: File | null,
  ): Promise<ImageUploadError | null> => {
    if (!image) {
      const removeImageRes = await userContext.protectedFetch(
        endpoints.removeEndpoint,
        {
          method: "DELETE ",
        },
      );

      return "remove_fail";
    }
    const requestUploadImageRes = await userContext.protectedFetch(
      endpoints.requestUploadEndpoint,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mimeType: image.type,
        }),
      },
    );

    if (isRequestError(requestUploadImageRes)) {
      return "request_upload_fail";
    }

    const { uploadUrl, imageId } = await requestUploadImageRes.json();
    const s3UploadRes = await fetch(uploadUrl, {
      method: "PUT",
      body: image,
      headers: {
        "Content-Type": image.type,
      }
    });

    if (isRequestError(s3UploadRes)) {
      return "upload_fail";
    }

    const notifyUploadRes = await userContext.protectedFetch(
      endpoints.notifyUploadEndpoint,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageId,
        }),
      },
    );

    if (isRequestError(notifyUploadRes)) {
      userContext.protectedFetch(
        endpoints.removeEndpoint,
        {
          method: "DELETE ",
        },
      );
      return "notify_upload_fail";
    }

    return null;
  };

  return (
    <AssetContext value={{ uploadImage }}>
      {children}
    </AssetContext>
  )
}