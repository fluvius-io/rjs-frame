/**
 * Example: Safe URL Fragment Management with /-/ Separator
 * 
 * This example demonstrates how to use the new URL utilities that ensure
 * the page name is never accidentally changed when updating URL fragments.
 * Also shows support for boolean flags (fragments without colons).
 */

import {
  parseUrlPath,
  buildUrlPath,
  updateUrlFragments,
  addUrlFragment,
  removeUrlFragment,
  updateBrowserUrlFragments,
  addSlotParam,
  removeSlotParam,
  updateSlotParamsPartial,
  URL_FRAGMENT_SEPARATOR,
  isValidFragmentName,
  FRAGMENT_NAME_PATTERN
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
const parsed = parseUrlPath(mixedUrl);

console.log(`Parsing: ${mixedUrl}`);
console.log('Result:', {
  pageName: parsed.pageName,        // 'admin'
  slotParams: parsed.slotParams,    // { filter: 'active', sort: 'name', page: '1', debug: true, readonly: true }
  slotStatus: parsed.slotStatus     // { filter: 'active', sort: 'active', page: 'active', debug: 'active', readonly: 'active' }
});

// Parse URL with only boolean flags
const flagsUrl = '/dashboard/-/debug/xray/readonly';
const flagsParsed = parseUrlPath(flagsUrl);

console.log(`\nParsing flags only: ${flagsUrl}`);
console.log('Result:', {
  pageName: flagsParsed.pageName,        // 'dashboard'
  slotParams: flagsParsed.slotParams,    // { debug: true, xray: true, readonly: true }
});

// Parse legacy format (still supported)
const legacyUrl = '/dashboard/user:123/tab:overview';
const legacyParsed = parseUrlPath(legacyUrl);

console.log(`\nParsing legacy format: ${legacyUrl}`);
console.log('Result:', {
  pageName: legacyParsed.pageName,
  slotParams: legacyParsed.slotParams
});

// ===== BUILDING URLS =====

console.log('\n=== Building URLs ===');

// Build URL with mixed fragment types
const newUrl = buildUrlPath('admin', {
  filter: 'pending',
  sort: 'date',
  view: 'list',
  debug: true,
  readonly: false  // false values are omitted
});

console.log('Building URL for page "admin" with mixed fragments:');
console.log('Params:', { filter: 'pending', sort: 'date', view: 'list', debug: true, readonly: false });
console.log('Result:', newUrl); // '/admin/-/filter:pending/sort:date/view:list/debug'

// Build URL with only boolean flags
const flagsOnlyUrl = buildUrlPath('settings', {
  advanced: true,
  expert: true,
  beta: false  // omitted
});

console.log('\nBuilding URL with boolean flags:');
console.log('Params:', { advanced: true, expert: true, beta: false });
console.log('Result:', flagsOnlyUrl); // '/settings/-/advanced/expert'

// ===== BOOLEAN FLAG EXAMPLES =====

console.log('\n=== Boolean Flag Examples ===');

// Example 1: Debug mode
const debugUrl = buildUrlPath('app', { debug: true });
console.log('Debug mode:', debugUrl); // '/app/-/debug'

const debugParsed = parseUrlPath('/app/-/debug');
console.log('Parsed debug:', debugParsed.slotParams); // { debug: true }

// Example 2: Mixed with string values
const mixedDebugUrl = buildUrlPath('admin', {
  filter: 'active',
  debug: true,
  page: '1'
});
console.log('Mixed with debug:', mixedDebugUrl); // '/admin/-/filter:active/page:1/debug'

// Example 3: Multiple flags
const multipleFlagsUrl = buildUrlPath('editor', {
  readonly: true,
  debug: true,
  advanced: true,
  beta: false  // omitted
});
console.log('Multiple flags:', multipleFlagsUrl); // '/editor/-/readonly/debug/advanced'

// ===== SAFE FRAGMENT UPDATES =====

console.log('\n=== Safe Fragment Updates (Page Name Preserved) ===');

// Simulate current URL state
const mockWindow = {
  location: {
    pathname: '/admin/-/filter:active/sort:name',
    search: ''
  }
};

// Method 1: Update all fragments (replaces existing)
console.log('Current URL: /admin/-/filter:active/sort:name');

const updatedUrl = updateUrlFragments({
  filter: 'pending',
  sort: 'date',
  page: '2'
});

console.log('After updateUrlFragments:', updatedUrl);
// Result: '/admin/-/filter:pending/sort:date/page:2'
// ✅ Page name 'admin' is preserved

// Method 2: Add/update single fragment
const withNewFragment = addUrlFragment('view', 'grid');
console.log('After addUrlFragment("view", "grid"):', withNewFragment);
// Result: '/admin/-/filter:active/sort:name/view:grid'
// ✅ Page name and existing fragments preserved

// Method 3: Remove single fragment
const withoutFilter = removeUrlFragment('filter');
console.log('After removeUrlFragment("filter"):', withoutFilter);
// Result: '/admin/-/sort:name'
// ✅ Page name preserved, only filter removed

// ===== STORE INTEGRATION =====

console.log('\n=== Page Store Integration ===');

// These functions work with the page store and update the browser URL safely:

// Add a single parameter
console.log('addSlotParam("tab", "settings")');
// ✅ Adds tab:settings while preserving page name and other params

// Remove a parameter
console.log('removeSlotParam("filter")');
// ✅ Removes filter param while preserving page name and other params

// Update multiple parameters
console.log('updateSlotParamsPartial({ sort: "date", page: "1" })');
// ✅ Updates only specified params while preserving page name and other params

// Update browser URL with fragments only
console.log('updateBrowserUrlFragments({ status: "active", view: "list" })');
// ✅ Updates URL fragments while preserving current page name

// ===== ERROR PREVENTION =====

console.log('\n=== Error Prevention Examples ===');

console.log('❌ WRONG: Manual URL construction can break page name');
console.log('   window.history.replaceState(null, "", "/newPage/filter:active")');
console.log('   // This could accidentally change page name!');

console.log('\n✅ CORRECT: Use safe utility functions');
console.log('   addSlotParam("filter", "active")');
console.log('   // This preserves the current page name');

console.log('\n✅ CORRECT: Use updateUrlFragments for complete replacement');
console.log('   const newUrl = updateUrlFragments({ filter: "active", sort: "name" })');
console.log('   // This preserves the current page name');

// ===== EDGE CASES =====

console.log('\n=== Edge Cases Handled ===');

// Empty fragments
const emptyFragmentsUrl = buildUrlPath('admin', {});
console.log('Empty fragments:', emptyFragmentsUrl); // '/admin'

// Empty page name
const noPageUrl = buildUrlPath('', { filter: 'active' });
console.log('Empty page name:', noPageUrl); // '/'

// Complex fragment values
const complexUrl = buildUrlPath('search', {
  query: 'user name',
  filters: 'status=active&type=user',
  page: '1'
});
console.log('Complex values:', complexUrl);
// '/search/-/query:user name/filters:status=active&type=user/page:1'

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

const urlWithInvalidNames = buildUrlPath('test', mixedValidInvalidParams);
console.log('Mixed valid/invalid params:', mixedValidInvalidParams);
console.log('Result URL (invalid names skipped):', urlWithInvalidNames);
// Expected: '/test/-/valid_param:value1/debug'
// Console warnings for: 'invalid-param', 'filter.type', 'user@domain'

// Example parsing URL with invalid names
console.log('\n=== Parsing URL with Invalid Names ===');
const urlWithInvalidFragments = '/admin/-/valid_param:value1/invalid-fragment/filter.type:docs/debug';
const parsedWithInvalid = parseUrlPath(urlWithInvalidFragments);

console.log('URL with invalid fragments:', urlWithInvalidFragments);
console.log('Parsed result (invalid names skipped):', parsedWithInvalid.slotParams);
// Expected: { valid_param: 'value1', debug: true }
// Console warnings for: 'invalid-fragment', 'filter.type'

export {}; 