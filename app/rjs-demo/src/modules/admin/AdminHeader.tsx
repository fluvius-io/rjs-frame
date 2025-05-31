import React from 'react';
import { PageModule } from 'rjs-frame';
import { Link } from 'react-router-dom';

export class AdminHeader extends PageModule {
  protected renderContent(): React.ReactNode {
    return (
      <header className="admin-header" style={{padding: '1rem'}}>
        <h1>Admin Dashboard</h1>
        <nav>
          <Link to="/">Back to Home</Link>
        </nav>
      </header>
    );
  }
} 