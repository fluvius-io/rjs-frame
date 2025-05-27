import React from 'react';
import { PageModule, PageModuleProps } from 'rjs-frame';
import { Link } from 'react-router-dom';

export class AdminHeader extends PageModule {
  protected renderContent(): React.ReactNode {
    return (
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <nav>
          <Link to="/">Back to Home</Link>
        </nav>
      </header>
    );
  }
} 