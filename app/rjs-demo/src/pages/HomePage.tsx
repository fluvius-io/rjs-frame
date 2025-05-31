import React from 'react';
import { GenericLayout } from '../layouts/GenericLayout';
import { getXRayEnabled, PageModule } from 'rjs-frame';
import { HomeHeader } from '../modules/home/HomeHeader';

const HomePage: React.FC = () => {
  return (
    <GenericLayout title="Home">
      <HomeHeader slotName="header" />
      <PageModule>
        <h3>Home Page</h3>
        <div style={{ padding: '1rem', backgroundColor: '#f0f8ff', border: '1px solid #007bff', borderRadius: '4px', marginBottom: '1rem' }}>
          <h4>🛠️ Debug Features Available</h4>
          <p>Use these keyboard shortcuts:</p>
          <ul>
            <li><kbd style={{ backgroundColor: '#e9ecef', padding: '0.2rem 0.4rem', borderRadius: '3px', fontFamily: 'monospace' }}>Option+O</kbd> / <kbd style={{ backgroundColor: '#e9ecef', padding: '0.2rem 0.4rem', borderRadius: '3px', fontFamily: 'monospace' }}>Win+O</kbd> - Open PageLayout Options dialog</li>
            <li><kbd style={{ backgroundColor: '#e9ecef', padding: '0.2rem 0.4rem', borderRadius: '3px', fontFamily: 'monospace' }}>Option+X</kbd> / <kbd style={{ backgroundColor: '#e9ecef', padding: '0.2rem 0.4rem', borderRadius: '3px', fontFamily: 'monospace' }}>Win+X</kbd> - Quick toggle X-Ray mode</li>
            <li><kbd style={{ backgroundColor: '#e9ecef', padding: '0.2rem 0.4rem', borderRadius: '3px', fontFamily: 'monospace' }}>Esc</kbd> - Close dialog</li>
          </ul>
          <p>In the PageLayout Options dialog you can:</p>
          <ul>
            <li>View layout information (Layout ID, Module slots, etc.)</li>
            <li>Toggle X-Ray mode for visual debugging</li>
            <li>See detailed module slot information</li>
            <li>See instance status and warnings for multiple instances</li>
            <li><strong>Manage PageParams</strong> - Add, edit, and validate URL parameters with real-time validation</li>
          </ul>
          <p><strong>Note:</strong> Only one PageLayout instance should be active at a time. The system automatically manages this and shows warnings if multiple instances are detected.</p>
          
          <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#e8f5e8', border: '1px solid #28a745', borderRadius: '4px' }}>
            <h5>💾 LocalStorage Persistence</h5>
            <p>The X-Ray mode setting is now stored in <code>localStorage</code> and will persist across page reloads. Current X-Ray status: <strong>{getXRayEnabled() ? 'Enabled' : 'Disabled'}</strong></p>
            <p><small>Try toggling X-Ray mode and refreshing the page - your setting will be remembered!</small></p>
          </div>

          <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '4px' }}>
            <h5>🔧 PageParams</h5>
            <p>The PageParams manager is now integrated into the PageLayout Options dialog. Press <kbd style={{ backgroundColor: '#e9ecef', padding: '0.2rem 0.4rem', borderRadius: '3px', fontFamily: 'monospace' }}>Option+O</kbd> / <kbd style={{ backgroundColor: '#e9ecef', padding: '0.2rem 0.4rem', borderRadius: '3px', fontFamily: 'monospace' }}>Win+O</kbd> to access it.</p>
            <p><small>Features: Real-time validation, boolean flags, pattern enforcement, and direct URL manipulation.</small></p>
          </div>
        </div>
      </PageModule>
    </GenericLayout>
  );
};

export default HomePage;
