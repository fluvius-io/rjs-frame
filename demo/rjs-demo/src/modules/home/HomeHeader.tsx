import React from 'react';
import { PageModule } from 'rjs-frame';
import { Link } from 'react-router-dom';

export class HomeHeader extends PageModule {
  protected renderContent(): React.ReactNode {
    return (
      <header className="home-header">
        <h1>Welcome to RJS Demo</h1>
        <nav>
            <span style={{padding: '10px', margin: '5px', border: '1px dashed cyan', display: 'inline-block'}}>
          <Link to="/">Home</Link>
          </span>
          <span style={{padding: '10px', margin: '5px', border: '1px dashed cyan', display: 'inline-block'}}>
          <Link to="/admin">Admin</Link>
          </span>
        </nav>
      </header>
    );
  }
} 