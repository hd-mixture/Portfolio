import React from 'react';
import DesignerHero from './DesignerHero';
import DesignerAboutServices from './DesignerAboutServices';
import DesignerFeaturedWork from './DesignerFeaturedWork';
import DesignerStatsTestimonial from './DesignerStatsTestimonial';
import DesignerHireMe from './DesignerHireMe';

async function getDesignerHeroData() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/hero?persona=designer`, { cache: 'no-store' });
        if (!res.ok) return null;
        return res.json();
    } catch (e) {
        return null;
    }
}

export default async function DesignerLayout() {
  const heroData = await getDesignerHeroData();

  return (
    <div className="designer-portfolio-wrapper min-h-screen bg-[#FAFAFC] dark:bg-[#121212] pb-24">
      <DesignerHero data={heroData} />
      <DesignerAboutServices />
      
      {/* Bento Bottom Row */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-6">
        <DesignerFeaturedWork />
      </div>

      {/* Hire Me Section */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-6">
        <DesignerHireMe />
      </div>
    </div>
  );
}
