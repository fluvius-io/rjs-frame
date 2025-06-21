/**
 * Example: Safe URL Fragment Management with /-/ Separator
 * 
 * This example demonstrates how to use the new URL utilities that ensure
 * the page name is never accidentally changed when updating URL fragments.
 * Also shows support for boolean flags (fragments without colons).
 */

import {
  parseUrl,
  buildPathFromAppState,
  updateBrowserLocation,
  addPageParam,
  removePageParam,
  updatePageParamsPartial,
  URL_FRAGMENT_SEPARATOR,
  isValidFragmentName,
  FRAGMENT_NAME_PATTERN,
  appStateStore
} from '../src/index';

// ===== BASIC URL STRUCTURE =====

console.log('=== URL Structure with /-/ Separator ===');
console.log(`Page name and fragments are separated by: ${URL_FRAGMENT_SEPARATOR}`);
console.log('Format: /pageName/-/arg1:value1/arg2:value2/booleanFlag');
console.log('Example: /admin/-/filter:active/sort:name/page:1/debug');

// ===== FRAGMENT TYPES =====

console.log('\n=== Fragment Types ===');
console.log('String values: filter:active, sort:name, page:1');
console.log('Boolean flags: debug, readonly, advanced (no colon = true)');
console.log('Empty values: filter: or filter (both become empty string)');

// ===== PARSING URLS =====

console.log('\n=== Parsing URLs ===');

// Parse a URL with mixed fragment types
const mixedUrl = '/admin/-/filter:active/sort:name/page:1/debug/readonly';
const parsed = parseUrl(mixedUrl);

console.log(`Parsing: ${mixedUrl}`);
console.log({
  pagePath: parsed.pagePath,        // 'admin'
  pageParams: parsed.pageParams,    // { filter: 'active', sort: 'name', page: '1', debug: true, readonly: false }
  linkParams: parsed.linkParams     // {}
});

// Parse URL with only boolean flags
const flagsUrl = '/dashboard/-/debug/xray/readonly';
const flagsParsed = parseUrl(flagsUrl);

console.log(`\nParsing flags only: ${flagsUrl}`);
console.log({
  pagePath: flagsParsed.pagePath,        // 'dashboard'
  pageParams: flagsParsed.pageParams,    // { debug: true, xray: true, readonly: true }
  linkParams: flagsParsed.linkParams     // {}
});

// Parse legacy format (still supported)
const legacyUrl = '/dashboard/user:123/tab:overview';
const legacyParsed = parseUrl(legacyUrl);

console.log(`\nParsing legacy format: ${legacyUrl}`);
console.log({
  pagePath: legacyParsed.pagePath,
  pageParams: legacyParsed.pageParams
});

// ===== BUILDING URLS =====

console.log('\n=== Building URLs ===');

// Build URL with mixed fragment types
const exampleAppState = {
  pageName: 'admin',
  breadcrumbs: ['admin'],
  pageParams: {
    filter: 'pending',
    sort: 'date',
    view: 'list',
    debug: true,
    readonly: false  // false values are omitted
  },
  linkParams: {},
  initTime: new Date().toISOString(),
  globalState: {},
  moduleState: {},
  auth: {},
  other: {}
};

console.log('Building URL for page "admin" with mixed fragments:');
console.log('Params:', exampleAppState.pageParams);
console.log('Use updateBrowserLocation(appState) to update browser URL');
// updateBrowserLocation(exampleAppState) would update URL to: '/admin/-/filter:pending/sort:date/view:list/debug'

// Build URL with only boolean flags
const flagsAppState = {
  ...exampleAppState,
  pageName: 'settings',
  breadcrumbs: ['settings'],
  pageParams: {
    advanced: true,
    expert: true,
    beta: false  // omitted
  }
};

console.log('\nBuilding URL with boolean flags:');
console.log('Params:', flagsAppState.pageParams);
console.log('Use updateBrowserLocation(appState) to update browser URL');
// updateBrowserLocation(flagsAppState) would update URL to: '/settings/-/advanced/expert'

// ===== BOOLEAN FLAG EXAMPLES =====

console.log('\n=== Boolean Flag Examples ===');

// Example 1: Debug mode
const debugAppState = {
  ...exampleAppState,
  pageName: 'app',
  breadcrumbs: ['app'],
  pageParams: { debug: true }
};
console.log('Debug mode appState for updateBrowserLocation()');
console.log('updateBrowserLocation(debugAppState) would create: /app/-/debug');

const debugParsed = parseUrl('/app/-/debug');
console.log('Parsed debug:', debugParsed.pageParams); // { debug: true }

// Example 2: Mixed with string values
const mixedDebugAppState = {
  ...exampleAppState,
  pageParams: {
    filter: 'active',
    debug: true,
    page: '1'
  }
};
console.log('Mixed with debug - use updateBrowserLocation(mixedDebugAppState)');
console.log('Would create: /admin/-/filter:active/page:1/debug');

// Example 3: Multiple flags
const multipleFlagsAppState = {
  ...exampleAppState,
  pageName: 'editor',
  breadcrumbs: ['editor'],
  pageParams: {
    readonly: true,
    debug: true,
    advanced: true,
    beta: false  // omitted
  }
};
console.log('Multiple flags - use updateBrowserLocation(multipleFlagsAppState)');
console.log('Would create: /editor/-/readonly/debug/advanced');

// ===== EDGE CASES =====

console.log('\n=== Edge Cases Handled ===');

// Empty fragments
const emptyFragmentsAppState = {
  ...exampleAppState,
  pageName: 'admin',
  breadcrumbs: ['admin'],
  pageParams: {}
};
console.log('Empty fragments - use updateBrowserLocation(emptyFragmentsAppState)');
console.log('Would create: /admin');

// Empty page name
const noPageAppState = {
  ...exampleAppState,
  pageName: '',
  breadcrumbs: [],
  pageParams: { filter: 'active' }
};
console.log('Empty page name - use updateBrowserLocation(noPageAppState)');
console.log('Would create: / (root)');

// Complex fragment values
const complexAppState = {
  ...exampleAppState,
  pageName: 'search',
  breadcrumbs: ['search'],
  pageParams: {
    query: 'user name',
    filters: 'status=active&type=user',
    page: '1'
  }
};
console.log('Complex values - use updateBrowserLocation(complexAppState)');
console.log('Would create: /search/-/query:user name/filters:status=active&type=user/page:1');

// ===== SUMMARY =====

console.log('\n=== Summary ===');
console.log('✅ Page name and fragments separated by /-/');
console.log('✅ Legacy format still supported for backward compatibility');
console.log('✅ Safe functions prevent accidental page name changes');
console.log('✅ Store integration automatically updates browser URL');
console.log('✅ Edge cases handled gracefully');
console.log('✅ TypeScript type safety maintained');

// ===== FRAGMENT NAME VALIDATION =====

console.log('\n=== Fragment Name Validation ===');

// Valid fragment names
console.log('Valid names:');
console.log('  filter:', isValidFragmentName('filter'));           // true
console.log('  user_id:', isValidFragmentName('user_id'));         // true
console.log('  Tab1:', isValidFragmentName('Tab1'));               // true
console.log('  myParam:', isValidFragmentName('myParam'));         // true

// Invalid fragment names
console.log('\nInvalid names:');
console.log('  my-param:', isValidFragmentName('my-param'));       // false
console.log('  filter.type:', isValidFragmentName('filter.type')); // false
console.log('  user@domain:', isValidFragmentName('user@domain')); // false
console.log('  param with spaces:', isValidFragmentName('param with spaces')); // false

// Show the validation pattern
console.log('\nValidation pattern:', FRAGMENT_NAME_PATTERN); // /^[\w\d_]+$/

// Example with invalid names (will show warnings in console)
console.log('\n=== Building URL with Invalid Names ===');
const mixedValidInvalidParams = {
  'valid_param': 'value1',
  'invalid-param': 'value2',  // Will be skipped with warning
  'filter.type': 'documents', // Will be skipped with warning
  'debug': true,              // Valid
  'user@domain': 'test'       // Will be skipped with warning
};

const invalidNamesAppState = {
  ...exampleAppState,
  pageName: 'test',
  breadcrumbs: ['test'],
  pageParams: mixedValidInvalidParams
};

console.log('Mixed valid/invalid params:', mixedValidInvalidParams);
console.log('Use updateBrowserLocation(invalidNamesAppState) - invalid names will be skipped with warnings');
console.log('Would create: /test/-/valid_param:value1/debug');
// Console warnings for: 'invalid-param', 'filter.type', 'user@domain'

// Example parsing URL with invalid names
console.log('\n=== Parsing URL with Invalid Names ===');
const urlWithInvalidFragments = '/admin/-/valid_param:value1/invalid-fragment/filter.type:docs/debug';
const parsedWithInvalid = parseUrl(urlWithInvalidFragments);

console.log('URL with invalid fragments:', urlWithInvalidFragments);
console.log('Parsed result (invalid names skipped):', parsedWithInvalid.pageParams);
// Expected: { valid_param: 'value1', debug: true }
// Console warnings for: 'invalid-fragment', 'filter.type'

export {}; 
