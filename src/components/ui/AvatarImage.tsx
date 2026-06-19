'use client';

import { useState } from 'react';

interface AvatarImageProps {
  src: string;
  fallback: string;
  className?: string;
}

/**
 * Renders an avatar image with a graceful text-initial fallback if the image
 * fails to load (e.g. broken URL, revoked storage access, etc.).
 */
export default function AvatarImage({ src, fallback, className = '' }: AvatarImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    return <span>{fallback}</span>;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="Avatar"
      className={`w-full h-full object-cover ${className}`}
      onError={() => setError(true)}
    />
  );
}
