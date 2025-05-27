import React from 'react';
import { PageModuleBase, PageModuleProps } from 'rjs-frame';
import { Link } from 'react-router-dom';

export class HomeHeader extends PageModuleBase {
  protected renderContent(): React.ReactNode {
    return (
      <header className="home-header">
        <h1>Welcome to RJS Demo</h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/admin">Admin</Link>
        </nav>
      </header>
    );
  }
} 