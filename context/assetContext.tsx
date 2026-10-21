"use client";

import React, { createContext, useContext } from "react";
import { UserContext } from "./userContext";
import { isRequestError } from "@/lib/error";

interface AssetUploadEndpoints {
  requestUploadEndpoint: string,
  notifyUploadEndpoint: string,
  removeEndpoint: string,
}

type AssetUploadError = "request_upload_fail" | "upload_fail" | "notify_upload_fail" | "remove_fail" | "remove_success";

export interface IAssetContext {
  uploadAsset: (endpoints: AssetUploadEndpoints, asset: File | null) => Promise<AssetUploadError | null>,
}

export const AssetContext = createContext<IAssetContext>({
  uploadAsset: function (endpoints: AssetUploadEndpoints, asset: File | null): Promise<AssetUploadError | null> {
    throw new Error("Function not implemented.");
  }
});

export function AssetContextProvider({ children }: { children: React.ReactNode }) {
  const userContext = useContext(UserContext);

  const uploadAsset = async (
    endpoints: AssetUploadEndpoints,
    asset: File | null,
  ): Promise<AssetUploadError | null> => {
    if (!asset) {
      const removeAssetRes = await userContext.protectedFetch(
        endpoints.removeEndpoint,
        {
          method: "DELETE ",
        },
      );
      if (isRequestError(removeAssetRes)) {
        return "remove_fail";
      }
      return "remove_success";
    }
    const requestUploadAssetRes = await userContext.protectedFetch(
      endpoints.requestUploadEndpoint,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mimeType: asset.type,
        }),
      },
    );

    if (isRequestError(requestUploadAssetRes)) {
      return "request_upload_fail";
    }

    const { uploadUrl, assetId } = await requestUploadAssetRes.json();
    const s3UploadRes = await fetch(uploadUrl, {
      method: "PUT",
      body: asset,
      headers: {
        "Content-Type": asset.type,
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
          assetId,
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
    <AssetContext value={{ uploadAsset }}>
      {children}
    </AssetContext>
  )
}