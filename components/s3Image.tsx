"use client"

import Image, { ImageProps } from "next/image";

function S3Image({ src, alt, ...props }: ImageProps) {
  let url = src;
  if (typeof src === 'string') {
    url = `${process.env.NEXT_PUBLIC_INTERNAL_ASSETS_URL}/${src}`;
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