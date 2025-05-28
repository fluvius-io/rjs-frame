import React from 'react';
import { GenericLayout } from '../layouts/GenericLayout';
import { HomeHeader } from '../modules/home/HomeHeader';

const HomePage: React.FC = () => {
  let modulesMount = {
    header: <HomeHeader key="header" />
  }
  return (
    <GenericLayout modules={modulesMount}>
      <h3>Home Page</h3>
    </GenericLayout>
  );
};

export default HomePage;
