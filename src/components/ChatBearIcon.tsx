"use client";

import React from 'react';
import Image from 'next/image';

type ChatBearIconProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export default function ChatBearIcon({ size = 'md', className = '' }: ChatBearIconProps) {
  const getSize = () => {
    switch (size) {
      case 'sm': return { width: 48, height: 48, class: 'w-12 h-12' };
      case 'lg': return { width: 96, height: 96, class: 'w-24 h-24' };
      case 'md':
      default: return { width: 64, height: 64, class: 'w-16 h-16' };
    }
  };

  const sizeData = getSize();

  return (
    <div className={`${sizeData.class} ${className} overflow-hidden rounded-full relative`}>
      <Image
        src="/favicon.png" 
        alt="Grizzly"
        width={sizeData.width}
        height={sizeData.height}
        className="object-cover w-full h-full"
        priority
      />
    </div>
  );
} 