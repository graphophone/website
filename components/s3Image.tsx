"use client"

import Image, { ImageProps } from "next/image";

function S3Image({ src, alt, ...props }: ImageProps) {
  const prefix = process.env.NEXT_PUBLIC_ASSETS_S3_PREFIX ?? '';
  
  return (
    <Image
      src={`${prefix}${src}`}
      alt={alt}
      {...props}
    />
  )
}

export default S3Image