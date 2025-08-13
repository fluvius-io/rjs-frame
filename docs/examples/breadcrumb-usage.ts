/**
 * Example: PageLayout Breadcrumb Management
 * 
 * This example demonstrates how to use the breadcrumb functionality
 * in PageLayout components to manage navigation context and automatically
 * update the global page name. Breadcrumbs are now stored in global appState.
 */

// ===== BASIC USAGE =====

console.log('=== PageLayout Breadcrumb Features ===');
console.log('');
console.log('1. title prop: Sets initial breadcrumb entry');
console.log('   Example: <MyLayout title="Dashboard" />');
console.log('');
console.log('2. Global store functions:');
console.log('   - setBreadcrumbs(array): Set entire breadcrumb path');
console.log('   - pushBreadcrumb(name): Add entry to end of breadcrumbs');
console.log('   - popBreadcrumb(): Remove last breadcrumb entry');
console.log('   - getBreadcrumbs(): Get current breadcrumb array');
console.log('');
console.log('3. Component methods (delegate to store):');
console.log('   - pushPage(name): Add entry to breadcrumbs');
console.log('   - popPage(): Remove last breadcrumb entry');
console.log('   - setBreadcrumbs(array): Set entire breadcrumb path');
console.log('   - getBreadcrumbs(): Get current breadcrumbs');
console.log('');
console.log('4. Global state storage:');
console.log('   - Breadcrumbs stored in appState.breadcrumbs');
console.log('   - Persist across component remounts');
console.log('   - Shared across entire application');
console.log('');
console.log('5. Automatic page name updates:');
console.log('   When breadcrumbs change, page name updates automatically');
console.log('   Format: breadcrumbs joined with " > " separator');

// ===== API EXAMPLES =====

// Import required items
// import { PageLayout, usePageLayout, setBreadcrumbs, pushBreadcrumb, popBreadcrumb, getBreadcrumbs } from 'rjs-frame';

// Class component usage
/*
class MyLayout extends PageLayout {
  constructor(props) {
    super(props);
    // breadcrumbs initialized from props.title and stored in global appState
  }

  handleNavigation = (page) => {
    this.pushPage(page); // Delegates to store function, updates global state
  };

  renderContent() {
    return (
      <div>
        <h1>Current: {this.getBreadcrumbs().join(' > ')}</h1>
        <button onClick={() => this.handleNavigation('Settings')}>
          Go to Settings
        </button>
      </div>
    );
  }
}

// Usage with title prop
<MyLayout title="Dashboard">
  <MyModule />
</MyLayout>
*/

// Direct store access
/*
import { setBreadcrumbs, pushBreadcrumb, popBreadcrumb, getBreadcrumbs, appStateStore } from 'rjs-frame';

// Set entire breadcrumb path
setBreadcrumbs(['App', 'Users', 'John Doe', 'Edit']);

// Add to end
pushBreadcrumb('Settings');

// Remove last
popBreadcrumb();

// Get current
const breadcrumbs = getBreadcrumbs();

// Subscribe to changes
const unsubscribe = appStateStore.subscribe((state) => {
  console.log('Breadcrumbs:', state.breadcrumbs);
});
*/

// Functional component usage with hook
/*
const BreadcrumbComponent = () => {
  const { breadcrumbs, pushPage, popPage, setBreadcrumbs } = usePageLayout();

  return (
    <div>
      <nav>Path: {breadcrumbs.join(' > ')}</nav>
      <button onClick={() => pushPage('Users')}>Add Users</button>
      <button onClick={() => popPage()}>Go Back</button>
    </div>
  );
};
*/

// ===== INTEGRATION PATTERNS =====

console.log('');
console.log('=== Integration Patterns ===');
console.log('');
console.log('Pattern 1: Global store access');
console.log('  Use setBreadcrumbs/pushBreadcrumb directly from any component');
console.log('');
console.log('Pattern 2: Component methods');
console.log('  Use pushPage/popPage methods on PageLayout instances');
console.log('');
console.log('Pattern 3: Hook access');
console.log('  Use usePageLayout() for functional component integration');
console.log('');
console.log('Pattern 4: Store subscription');
console.log('  Subscribe to appStateStore for real-time breadcrumb updates');

// ===== GLOBAL STATE BENEFITS =====

console.log('');
console.log('=== Global State Benefits ===');
console.log('');
console.log('Benefits of storing breadcrumbs in appState:');
console.log('  - Persistence: Survive component remounts');
console.log('  - Consistency: Single source of truth');
console.log('  - Reactivity: All components update automatically');
console.log('  - Accessibility: Direct store access for complex scenarios');
console.log('');
console.log('appState structure:');
console.log('  interface AppState {');
console.log('    name: string;');
console.log('    time: string;');
console.log('    breadcrumbs: string[];  // <-- Stored here');
console.log('    pageParams: PageParams;');
console.log('    linkParams: LinkParams;');
console.log('    // ... other properties');
console.log('  }');

// ===== MIGRATION GUIDE =====

console.log('');
console.log('=== Migration from Previous Version ===');
console.log('');
console.log('Simple prop rename:');
console.log('  Before: <MyLayout pageName="Dashboard" />');
console.log('  After:  <MyLayout title="Dashboard" />');
console.log('');
console.log('Enhanced capabilities:');
console.log('  - Breadcrumbs now persist across component lifecycles');
console.log('  - Multiple components can access same breadcrumb state');
console.log('  - Direct store access for advanced use cases');

export {}; 
