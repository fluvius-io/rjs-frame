import React from 'react';
import { HomeLayout } from '../layouts/GenericLayout';
import { HomeHeader } from '../modules/home/HomeHeader';

const HomePage: React.FC = () => {
  let slotItems = {
    header: [<HomeHeader key="header" slotId="header" />]
  }
  return (
    <HomeLayout modules={slotItems}>
      <h3>Home Page</h3>
    </HomeLayout>
  );
};

export default HomePage;
