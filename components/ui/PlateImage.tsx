'use client';

import Image from 'next/image';
import { useState } from 'react';
import { clsx } from '@/lib/clsx';
import { BrickMark } from './Wordmark';

interface PlateImageProps {
  src: string | null | undefined;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}

/**
 * next/image with a graceful branded fallback. When a photo slot is still
 * empty (the file is missing or fails to load), a clean ink plate with the
 * brick mark stands in, so the layout never shows a broken image. The client
 * simply drops the real photo into the slot to replace it.
 */
export function PlateImage({
  src,
  alt,
  sizes = '(max-width: 768px) 100vw, 50vw',
  priority = false,
  className,
}: PlateImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={clsx(
          'absolute inset-0 grid place-items-center bg-ink brick-grid-bg',
          className,
        )}
        role="img"
        aria-label={alt}
      >
        <BrickMark className="h-10 w-auto text-bone/25" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      onError={() => setFailed(true)}
      className={clsx('object-cover', className)}
    />
  );
}
