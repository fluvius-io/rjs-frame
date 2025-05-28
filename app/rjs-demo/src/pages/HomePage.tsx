import React, { useEffect } from 'react';
import { GenericLayout } from '../layouts/GenericLayout';
import { HomeHeader } from '../modules/home/HomeHeader';
import { pageStore, setPageName } from 'rjs-frame';

const HomePage: React.FC = () => {
  useEffect(() => {
    // Get current state to preserve slot parameters
    const currentState = pageStore.get();
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
