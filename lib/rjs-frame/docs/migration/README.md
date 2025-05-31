# Migration Guides

Guides for upgrading between rjs-frame versions.

## Version Upgrades

- **[Migration Guide](./MIGRATION.md)** - Complete upgrade guide covering:
  - PageLayout prop changes (`pageName` → `title`)
  - Breadcrumb system updates
  - Global state storage changes
  - Store function updates
  - Component method changes

## Breaking Changes by Version

### v2.x → v3.x
- **PageLayout Props**: `pageName` prop renamed to `title`
- **Breadcrumb Storage**: Moved from local component state to global pageState
- **State Management**: Enhanced store functions for cross-component communication

### v1.x → v2.x
- **URL Management**: Centralized URL update functions
- **Function Naming**: Consistent naming patterns for utilities
- **PageState Interface**: Restructured for better organization

## Migration Support

- **Backward Compatibility**: Most component methods still work
- **Gradual Migration**: Update incrementally when convenient
- **Enhanced Features**: New capabilities available after migration

## Getting Help

1. Review the detailed [Migration Guide](./MIGRATION.md)
2. Check component documentation in [API Reference](../api/)
3. Test changes in development environment first
4. Use debug tools to verify functionality 