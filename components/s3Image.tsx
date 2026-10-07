"use client"

import { identityAssetPrefix } from "@/constants/assets";
import Image, { ImageProps } from "next/image";

function S3Image({ src, alt, ...props }: ImageProps) {
  let url = src;
  if (typeof src === 'string') {
    let [host, uri] = ['', ''];
    if (src.startsWith(identityAssetPrefix)) {
      host = process.env.NEXT_PUBLIC_IDENTITY_ASSETS_HOST!;
      uri = src.slice(identityAssetPrefix.length);
    }
    url = `${host}${uri}`;
  }
  
  return (
    <Image
      src={url}
      alt={alt}
      {...props}
    />
  )
}

export default S3Image