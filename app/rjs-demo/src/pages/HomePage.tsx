import React, { useEffect } from 'react';
import { GenericLayout } from '../layouts/GenericLayout';
import { HomeHeader } from '../modules/home/HomeHeader';
import { setPageName } from 'rjs-frame/src/store/pageStore';

const HomePage: React.FC = () => {
  useEffect(() => {
    setPageName('home');
  }, []);

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
