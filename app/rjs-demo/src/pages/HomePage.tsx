import React, { useEffect } from 'react';
import { GenericLayout } from '../layouts/GenericLayout';
import { setPageName, getXRayEnabled } from 'rjs-frame';
import { HomeHeader } from '../modules/home/HomeHeader';
import { ArgumentsModule } from '@/modules/ArgumentsModule';

const HomePage: React.FC = () => {
  useEffect(() => {
    setPageName('home');
  }, []);

  return (
    <GenericLayout>
      <HomeHeader slotName="header" />
      <ArgumentsModule>
        <h3>Home Page</h3>
        <div style={{ padding: '1rem', backgroundColor: '#f0f8ff', border: '1px solid #007bff', borderRadius: '4px', marginBottom: '1rem' }}>
          <h4>🛠️ Debug Features Available</h4>
          <p>Use these keyboard shortcuts:</p>
          <ul>
            <li><kbd style={{ backgroundColor: '#e9ecef', padding: '0.2rem 0.4rem', borderRadius: '3px', fontFamily: 'monospace' }}>Ctrl+O</kbd> - Open PageLayout Options dialog</li>
            <li><kbd style={{ backgroundColor: '#e9ecef', padding: '0.2rem 0.4rem', borderRadius: '3px', fontFamily: 'monospace' }}>Cmd+X</kbd> (Mac) / <kbd style={{ backgroundColor: '#e9ecef', padding: '0.2rem 0.4rem', borderRadius: '3px', fontFamily: 'monospace' }}>Alt+X</kbd> (Windows/Linux) - Quick toggle X-Ray mode</li>
            <li><kbd style={{ backgroundColor: '#e9ecef', padding: '0.2rem 0.4rem', borderRadius: '3px', fontFamily: 'monospace' }}>Esc</kbd> - Close dialog</li>
          </ul>
          <p>In the PageLayout Options dialog you can:</p>
          <ul>
            <li>View layout information (Layout ID, Module slots, etc.)</li>
            <li>Toggle X-Ray mode for visual debugging</li>
            <li>See detailed module slot information</li>
            <li>See instance status and warnings for multiple instances</li>
          </ul>
          <p><strong>Note:</strong> Only one PageLayout instance should be active at a time. The system automatically manages this and shows warnings if multiple instances are detected.</p>
          
          <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#e8f5e8', border: '1px solid #28a745', borderRadius: '4px' }}>
            <h5>💾 LocalStorage Persistence</h5>
            <p>The X-Ray mode setting is now stored in <code>localStorage</code> and will persist across page reloads. Current X-Ray status: <strong>{getXRayEnabled() ? 'Enabled' : 'Disabled'}</strong></p>
            <p><small>Try toggling X-Ray mode and refreshing the page - your setting will be remembered!</small></p>
          </div>
        </div>
      </ArgumentsModule>
    </GenericLayout>
  );
};

export default HomePage;
