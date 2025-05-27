import React from 'react';
import { PageModuleBase, PageModuleProps } from 'rjs-frame';
import { Link } from 'react-router-dom';

export class AdminHeader extends PageModuleBase {
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