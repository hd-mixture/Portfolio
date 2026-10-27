import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import HeroClientUI from './HeroClientUI';

async function getHeroData(persona: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/hero?persona=${persona}`, { cache: 'no-store' });
        if (!res.ok) return null;
        return res.json();
    } catch (e) {
        return null;
    }
}

export default async function Hero() {
  const developerData = await getHeroData('developer');
  const designerData = await getHeroData('designer');

  return (
    <HeroClientUI 
        developerData={developerData}
        designerData={designerData}
    />
  );
} 