import React from 'react';
import { HomeLayout } from '../layouts/HomeLayout';
import { HomeHeader } from '../modules/home/HomeHeader';

const HomePage: React.FC = () => {
  return (
    <HomeLayout>
      <HomeHeader slotId="header" />
    </HomeLayout>
  );
};

export default HomePage;
