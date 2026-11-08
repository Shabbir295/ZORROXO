import React from 'react';
import Hero from '../components/home/Hero';
import Categories from '../components/home/Categories';
import Bestsellers from '../components/home/Bestsellers';
import EditorialBanner from '../components/home/EditorialBanner';
import NewArrivals from '../components/home/NewArrivals';
import BrandStory from '../components/home/BrandStory';
import SocialGallery from '../components/home/SocialGallery';
import Newsletter from '../components/home/Newsletter';

export default function Home() {
  return (
    <div className="bg-ivory">
      <Hero />
      <Categories />
      <Bestsellers />
      <EditorialBanner />
      <NewArrivals />
      <BrandStory />
      <SocialGallery />
      <Newsletter />
    </div>
  );
}